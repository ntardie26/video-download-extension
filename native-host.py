#!/usr/bin/env python3
import sys
import json
import struct
import subprocess
import os
import re
from pathlib import Path

# Native messaging protocol
def send_message(message):
    encoded_message = json.dumps(message).encode('utf-8')
    sys.stdout.buffer.write(struct.pack('I', len(encoded_message)))
    sys.stdout.buffer.write(encoded_message)
    sys.stdout.flush()

def read_message():
    text_length_bytes = sys.stdin.buffer.read(4)
    if not text_length_bytes:
        return None
    
    text_length = struct.unpack('i', text_length_bytes)[0]
    text = sys.stdin.buffer.read(text_length).decode('utf-8')
    return json.loads(text)

def get_binary_path(binary_name):
    if sys.platform == 'win32':
        return os.path.join(os.path.dirname(os.path.abspath(__file__)), 'binaries', f'{binary_name}.exe')
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), 'binaries', binary_name)

def run_yt_dlp(url, output, format, codec, options):
    yt_dlp_path = get_binary_path('yt-dlp')
    ffmpeg_path = get_binary_path('ffmpeg')
    
    command = [
        yt_dlp_path,
        '--ffmpeg-location', ffmpeg_path,
        '--format', format,
        '--output', output,
        '--progress',
        '--newline'
    ]
    
    if options.get('stripAudio'):
        command.extend(['--extract-audio', '--audio-format', 'mp3'])
    if options.get('downloadSubtitles'):
        command.extend(['--write-sub', '--write-auto-sub'])
    if options.get('downloadThumbnail'):
        command.append('--write-thumbnail')
    if options.get('downloadMetadata'):
        command.append('--write-info-json')
    
    command.append(url)
    
    try:
        process = subprocess.Popen(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            universal_newlines=True
        )
        
        while True:
            line = process.stdout.readline()
            if not line:
                break
            
            # Parse progress
            progress_match = re.search(r'\[download\]\s+(\d+\.?\d*)%', line)
            if progress_match:
                progress = float(progress_match.group(1))
                send_message({
                    'type': 'PROGRESS',
                    'progress': progress
                })
        
        process.wait()
        
        if process.returncode == 0:
            return {'success': True}
        else:
            error = process.stderr.read()
            return {'success': False, 'error': error}
            
    except Exception as e:
        return {'success': False, 'error': str(e)}

def run_cobalt(url, output, format, codec, options):
    cobalt_path = get_binary_path('cobalt')
    
    command = [
        cobalt_path,
        '--url', url,
        '--output', output,
        '--format', format
    ]
    
    if options.get('stripAudio'):
        command.append('--audio-only')
    
    try:
        process = subprocess.Popen(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            universal_newlines=True
        )
        
        while True:
            line = process.stdout.readline()
            if not line:
                break
            
            # Parse progress
            progress_match = re.search(r'Progress:\s+(\d+)%', line)
            if progress_match:
                progress = float(progress_match.group(1))
                send_message({
                    'type': 'PROGRESS',
                    'progress': progress
                })
        
        process.wait()
        
        if process.returncode == 0:
            return {'success': True}
        else:
            error = process.stderr.read()
            return {'success': False, 'error': error}
            
    except Exception as e:
        return {'success': False, 'error': str(e)}

def main():
    while True:
        message = read_message()
        if message is None:
            break
        
        try:
            engine = message.get('engine', 'yt-dlp')
            url = message['url']
            output = message['output']
            format = message['format']
            codec = message.get('codec', 'best')
            options = message.get('options', {})
            
            # Create output directory if it doesn't exist
            os.makedirs(os.path.dirname(output), exist_ok=True)
            
            if engine == 'yt-dlp':
                result = run_yt_dlp(url, output, format, codec, options)
            else:
                result = run_cobalt(url, output, format, codec, options)
            
            send_message(result)
            
        except Exception as e:
            send_message({'success': False, 'error': str(e)})

if __name__ == '__main__':
    main() 