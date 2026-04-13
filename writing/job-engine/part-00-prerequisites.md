# Chapter 0: Before You Start

[← Series Overview](README.md) | [Chapter 1: Your First Day →](part-01-project-setup.md)

---

You need three things installed before writing any code: Java 21, Gradle, and a terminal. That's it. No Docker, no databases, no Kafka — the job engine runs entirely in-memory.

## Java 21

The engine uses virtual threads, `AtomicReference`, `LongAdder`, and other `java.util.concurrent` classes that require Java 21.

### macOS (Homebrew)

```bash
brew install openjdk@21
```

After install, add it to your path:

```bash
echo 'export PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### macOS / Linux (SDKMAN — recommended)

SDKMAN manages multiple Java versions. Install it first:

```bash
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
```

Then install Java 21:

```bash
sdk install java 21.0.4-tem
```

### Linux (apt — Ubuntu/Debian)

```bash
sudo apt update
sudo apt install openjdk-21-jdk
```

### Windows (winget)

```powershell
winget install EclipseAdoptium.Temurin.21.JDK
```

Or download manually from [Adoptium](https://adoptium.net/temurin/releases/?version=21).

### Windows (scoop)

```powershell
scoop bucket add java
scoop install temurin21-jdk
```

### Verify

```bash
java -version
```

You should see something like:

```
openjdk version "21.0.4" 2024-07-16 LTS
```

Any 21.x version works. The exact patch doesn't matter.

---

## Gradle 8.10

Gradle builds the project and runs the tests. You don't need to install it globally — the project includes a Gradle wrapper (`gradlew`) that downloads the right version automatically. But if you want it available system-wide:

### macOS (Homebrew)

```bash
brew install gradle
```

### SDKMAN (any OS)

```bash
sdk install gradle 8.10
```

### Linux (manual)

```bash
curl -L https://services.gradle.org/distributions/gradle-8.10-bin.zip -o gradle-8.10.zip
unzip gradle-8.10.zip -d /opt
echo 'export PATH="/opt/gradle-8.10/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### Windows (scoop)

```powershell
scoop install gradle
```

### Verify

```bash
gradle --version
```

Or skip the global install entirely — the project's `./gradlew` (or `gradlew.bat` on Windows) handles everything:

```bash
./gradlew --version
```

---

## Quick Check — Everything Works

Run this to verify your setup in one shot:

```bash
# Create a temp project, compile, and run a test
mkdir /tmp/java-check && cd /tmp/java-check

# Create a minimal Java file
cat > Hello.java << 'EOF'
public class Hello {
    public static void main(String[] args) {
        // Virtual threads — requires Java 21
        Thread.ofVirtual().start(() ->
            System.out.println("Java 21 + virtual threads: OK")
        ).join();
    }
}
EOF

# Compile and run
java Hello.java

# Clean up
cd - && rm -rf /tmp/java-check
```

If you see `Java 21 + virtual threads: OK`, you're good. If you get an error about `ofVirtual()`, your Java version is too old.

---

## What You DON'T Need

| Tool | Needed? | Why not |
|------|---------|---------|
| Docker | No | Everything runs in-memory, no external services |
| PostgreSQL | No | No database in this project |
| Kafka | No | No message queue (that's the bank transfer series) |
| Maven | No | We use Gradle |
| IDE | Optional | Any text editor works. IntelliJ or VS Code recommended but not required |

---

## One-Liner Setup (macOS/Linux)

If you're starting from scratch and want everything in one go:

```bash
# Install SDKMAN + Java 21 + Gradle
curl -s "https://get.sdkman.io" | bash \
  && source "$HOME/.sdkman/bin/sdkman-init.sh" \
  && sdk install java 21.0.4-tem \
  && sdk install gradle 8.10 \
  && java -version \
  && gradle --version
```

---

That's it. Java 21 and Gradle. Let's build the engine.

[← Series Overview](README.md) | [Chapter 1: Your First Day →](part-01-project-setup.md)
