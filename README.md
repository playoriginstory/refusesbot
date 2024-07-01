# Dependencies, Build and Deployment Instructions

## C# 

### IDE
- [Rider](https://www.jetbrains.com/rider/download/)
- [Visual Studio](https://visualstudio.microsoft.com/it/downloads/)
- [Visual Studio Code](https://code.visualstudio.com/download)

### Dependencies

#### Option A
Using the **nuget** window in your IDE, add `Telegram.Bot` and `Telegram.Bot.Extensions.Polling` to your packages. 

#### Option B
Type these commands in your terminal and press <kbd>enter</kbd> after each one.

```shell
dotnet add package Telegram.Bot
dotnet add package Telegram.Bot.Extensions.Polling
```

### Export Your Project

#### Option A
Type this command in your terminal and press <kbd>enter</kbd>.
```shell
dotnet publish -c release --self-contained --runtime linux-x64 
```

Copy everything from <code>bin/release/netXXX/linux-x64</code> to your <code>TBotRemote</code> folder.


#### Option B
Type this command in your terminal and press <kbd>enter</kbd>.
```shell
dotnet build
```

Copy everything from <code>bin/release/net6.0</code> to your <code>TBotRemote</code> folder.


### Run Your Bot

#### Option A
Type these commands in your server terminal and press <kbd>enter</kbd> after each one.

```shell
cd TBotRemote
chmod +x TutorialBot
./TutorialBot
```

#### Option B
Type these commands in your server terminal and press <kbd>enter</kbd> after each one.

```shell
sudo apt-get update
sudo apt-get install -y apt-transport-https
sudo apt-get update
sudo apt-get install -y dotnet-runtime-6.0
```

Now that you have installed the runtime environment, run:

```shell
cd TBotRemote
dotnet TutorialBot.dll
```


## Python

### IDE
- [PyCharm](https://www.jetbrains.com/pycharm/download/)
- [Visual Studio Code](https://code.visualstudio.com/download)

### Dependencies

Type this command in your terminal and press <kbd>enter</kbd>.

```shell
pip install python-telegram-bot==13.12
```

### Export Your Project

Copy your **source file** from your project folder to your <code>TBotRemote</code> folder.

### Run Your Bot
Type this command in your terminal and press <kbd>enter</kbd>.

```shell
cd TBotRemote
python TutorialBot.py
```


## Go

### IDE
- [GoLand](https://www.jetbrains.com/go/download)
- [Visual Studio Code](https://code.visualstudio.com/download)

### Dependencies
Type these commands in your terminal and press <kbd>enter</kbd> after each one.

```shell
go mod init example.com/TutorialBot
go mod tidy
```

### Export Your Project

#### Option A

You can use source file as executables using <code>go run TutorialBot.go</code>

#### Option B
You can build a static executable.

Type this command in your terminal and press <kbd>enter</kbd>.

**Nix Shell**

```shell
GOOS=linux GOARCH=amd64 go build -o bot
```

**Powershell**

```shell
$env:GOOS='linux'; $env:GOARCH='amd64'; go build -o bot
```
Please replace <code>GOOS</code> and <code>GOARCH</code> according to your target machine.

#### Run Your Bot

If you're running source files directly, you'll need an up-to-date version of the [Golang runtime](https://go.dev/doc/install).

Once you have installed it, type this command in your terminal and press <kbd>enter</kbd>.

```shell
go run bot.go
```

If you're running the static executable, type these commands in your terminal and press <kbd>enter</kbd> after each one.

```shell
cd TBotRemote
chmod +x TutorialBot
./TutorialBot
```


## TypeScript on Node.js

### IDE
- [WebStorm](https://www.jetbrains.com/webstorm/)
- [Visual Studio Code](https://code.visualstudio.com/download)

### Dependencies

Type these commands in your terminal and press <kbd>enter</kbd>.

```shell
sudo apt-get update
sudo apt-get install -y nodejs

npm install
```

### Export Your Project

Copy your **source file** and `package.json` file from your project folder to your <code>TBotRemote</code> folder.


### Run Your Bot

Type these commands in your terminal and press <kbd>enter</kbd>.

```shell
cd TBotRemote
npm install
npm start
```

