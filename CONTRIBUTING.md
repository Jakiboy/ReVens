# Contributing to ReVens

Thank you for considering contributing to **ReVens** - The Ultimate Reverse Engineering Toolkit AIO! Follow the steps below to get started.

## How to Contribute

### 1. Fork the Repository

Click the **Fork** button in the top-right corner of the [ReVens repository](https://github.com/Jakiboy/ReVens).

### 2. Clone Your Fork

```bash
git clone https://github.com/your-username/ReVens.git
cd ReVens
```

See [installation setup & requirements](README.md#installation).

### 3. Create a New Branch

```bash
git checkout -b feature/your-feature-name
```

### 4. Make Your Changes

* Follow the project's coding style and guidelines.
* Ensure your changes are well-documented and tested if applicable.

#### Adding Items to ReVens Packages Manager

If you think a missing reverse engineering tool can be added to ReVens Packages Manager, you can add it in the `src/config/items.json`.

**Important requirements:**
* Only items with **open-source code** and download URL from **GitHub** will be accepted
* **NO EXTERNAL URLS** (only GitHub-hosted releases and downloads)
* Tools must be relevant to reverse engineering, security research, or penetration testing
* Ensure the item follows the existing JSON structure and includes:
  - `name`, `slug`, `desc`, `type`, `path`, `section`, `sub`
  - `url` (GitHub repository)
  - `download` (GitHub release or download link)
  - `version` (if available)

### 5. Commit Your Changes

```bash
git add .
git commit -m "Add your descriptive commit message"
```

### 6. Push to Your Branch

```bash
git push origin feature/your-feature-name
```

### 7. Open a Pull Request

Go to the [original repository](https://github.com/Jakiboy/ReVens) and open a pull request.
Provide a clear description of the changes you made.

## Testing

Before submitting your pull request, run the following test and validation scripts:

```bash
# Test items.json structure and validate entries
./scripts/test.cmd

# Fix common issues in items.json
./scripts/fix.cmd
```

## Code of Conduct

* Be respectful and constructive in discussions
* Focus on security and educational purposes only
* Do not submit malicious tools or content

## Getting Help

If you have questions or need assistance:
* Open an [issue](https://github.com/Jakiboy/ReVens/issues)
* Check existing documentation in the [README](README.md)
* Review the [items.json](src/config/items.json) structure for examples

Thank you for contributing to ReVens!
