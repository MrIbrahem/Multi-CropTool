
cd /data/project/nccroptool/

rm -r Multi-CropTool-main
rm main.zip

# Download the wd-core repository from GitHub.
wget https://github.com/MrIbrahem/Multi-CropTool/archive/refs/heads/main.zip -O main.zip

# Unzip the downloaded zip file
unzip main.zip

rm -r -f public_html/mass
# Copy all the remaining files and directories from the 'Multi-CropTool-main' directory
# Into a new directory called 'wd_core/' in the current working directory
cp -r Multi-CropTool-main/public_html/mass public_html/mass

chmod -R 6770 public_html

# Remove the `Multi-CropTool-main` directory.
rm -r Multi-CropTool-main

# Remove the `main.zip` file.
rm main.zip

