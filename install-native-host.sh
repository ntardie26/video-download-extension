#!/bin/bash

# Get the absolute path of the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Function to install for Chrome
install_chrome() {
    local target_dir
    
    # Determine target directory based on OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        target_dir="$HOME/Library/Application Support/Google/Chrome/NativeMessagingHosts"
    else
        target_dir="$HOME/.config/google-chrome/NativeMessagingHosts"
    fi
    
    # Create target directory if it doesn't exist
    mkdir -p "$target_dir"
    
    # Copy manifest file
    cp "$SCRIPT_DIR/com.simplevideodownloader.json" "$target_dir/"
    
    # Update manifest with absolute path
    sed -i.bak "s|\"path\": \"native-host.py\"|\"path\": \"$SCRIPT_DIR/native-host.py\"|g" "$target_dir/com.simplevideodownloader.json"
    rm -f "$target_dir/com.simplevideodownloader.json.bak"
    
    # Make native host script executable
    chmod +x "$SCRIPT_DIR/native-host.py"
    
    echo "Native messaging host installed for Chrome"
}

# Function to install for Firefox
install_firefox() {
    local target_dir
    
    # Determine target directory based on OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        target_dir="$HOME/Library/Application Support/Mozilla/NativeMessagingHosts"
    else
        target_dir="$HOME/.mozilla/native-messaging-hosts"
    fi
    
    # Create target directory if it doesn't exist
    mkdir -p "$target_dir"
    
    # Copy manifest file
    cp "$SCRIPT_DIR/com.simplevideodownloader.json" "$target_dir/"
    
    # Update manifest with absolute path
    sed -i.bak "s|\"path\": \"native-host.py\"|\"path\": \"$SCRIPT_DIR/native-host.py\"|g" "$target_dir/com.simplevideodownloader.json"
    rm -f "$target_dir/com.simplevideodownloader.json.bak"
    
    # Make native host script executable
    chmod +x "$SCRIPT_DIR/native-host.py"
    
    echo "Native messaging host installed for Firefox"
}

# Function to uninstall
uninstall() {
    # Chrome
    if [[ "$OSTYPE" == "darwin"* ]]; then
        rm -f "$HOME/Library/Application Support/Google/Chrome/NativeMessagingHosts/com.simplevideodownloader.json"
    else
        rm -f "$HOME/.config/google-chrome/NativeMessagingHosts/com.simplevideodownloader.json"
    fi
    
    # Firefox
    if [[ "$OSTYPE" == "darwin"* ]]; then
        rm -f "$HOME/Library/Application Support/Mozilla/NativeMessagingHosts/com.simplevideodownloader.json"
    else
        rm -f "$HOME/.mozilla/native-messaging-hosts/com.simplevideodownloader.json"
    fi
    
    echo "Native messaging host uninstalled"
}

# Main script
case "$1" in
    "chrome")
        install_chrome
        ;;
    "firefox")
        install_firefox
        ;;
    "both")
        install_chrome
        install_firefox
        ;;
    "uninstall")
        uninstall
        ;;
    *)
        echo "Usage: $0 {chrome|firefox|both|uninstall}"
        exit 1
        ;;
esac

exit 0