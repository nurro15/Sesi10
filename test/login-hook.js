
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const chrome = require("selenium-webdriver/chrome");

describe("Automation Test Login - Belajar Bareng", function () {
    this.timeout(60000);

    let driver;

    // HOOK 1: Membuka browser sebelum semua test
    before(async function () {
        const options = new chrome.Options();

        options.addArguments("--disable-features=PasswordLeakDetection");

        options.setUserPreferences({
            credentials_enable_service: false,
            "profile.password_manager_enabled": false,
            "profile.password_manager_leak_detection": false
        });

        driver = await new Builder()
            .forBrowser("chrome")
            .setChromeOptions(options)
            .build();
    });

    // HOOK 2: Membuka halaman login sebelum setiap test
    beforeEach(async function () {
        await driver.get("https://belajar-bareng.onrender.com/");
    });

    // TEST 1: Login dengan username dan password benar
    it("Login berhasil dengan username dan password benar", async function () {
        await driver.findElement(
            By.css('[data-testid="username-input"]')
        ).sendKeys("admin");

        await driver.findElement(
            By.css('[data-testid="password-input"]')
        ).sendKeys("admin");

        await driver.findElement(
            By.css('[data-testid="login-button"]')
        ).click();

        await driver.wait(until.urlContains("/users"), 10000);

        assert.ok(
            (await driver.getCurrentUrl()).includes("/users"),
            "Login seharusnya berhasil"
        );
    });

    // TEST 2: Login dengan password salah
    it("Login gagal dengan password salah", async function () {
        await driver.findElement(
            By.css('[data-testid="username-input"]')
        ).sendKeys("admin");

        await driver.findElement(
            By.css('[data-testid="password-input"]')
        ).sendKeys("salah123");

        await driver.findElement(
            By.css('[data-testid="login-button"]')
        ).click();

        await driver.sleep(500);

        assert.ok(
            !(await driver.getCurrentUrl()).includes("/users"),
            "Login seharusnya ditolak"
        );
    });

    // TEST 3: Login dengan username salah
    it("Login gagal dengan username salah", async function () {
        await driver.findElement(
            By.css('[data-testid="username-input"]')
        ).sendKeys("user_salah");

        await driver.findElement(
            By.css('[data-testid="password-input"]')
        ).sendKeys("admin");

        await driver.findElement(
            By.css('[data-testid="login-button"]')
        ).click();

        await driver.sleep(500);

        assert.ok(
            !(await driver.getCurrentUrl()).includes("/users"),
            "Login seharusnya ditolak"
        );
    });

    // TEST 4: Login tanpa username
    it("Login gagal jika username kosong", async function () {
        await driver.findElement(
            By.css('[data-testid="password-input"]')
        ).sendKeys("admin");

        await driver.findElement(
            By.css('[data-testid="login-button"]')
        ).click();

        const username = await driver.findElement(
            By.css('[data-testid="username-input"]')
        );

        assert.strictEqual(
            await username.getAttribute("validationMessage"),
            "Please fill out this field.",
            "Validasi username seharusnya muncul"
        );
    });

    // TEST 5: Login tanpa password
    it("Login gagal jika password kosong", async function () {
        await driver.findElement(
            By.css('[data-testid="username-input"]')
        ).sendKeys("admin");

        await driver.findElement(
            By.css('[data-testid="login-button"]')
        ).click();

        const password = await driver.findElement(
            By.css('[data-testid="password-input"]')
        );

        assert.strictEqual(
            await password.getAttribute("validationMessage"),
            "Please fill out this field.",
            "Validasi password seharusnya muncul"
        );
    });

    // HOOK 3: Dijalankan setelah setiap test
    afterEach(async function () {
        if (this.currentTest) {
            console.log("Test selesai:", this.currentTest.title);
            console.log("Status:", this.currentTest.state);
        }
    });

    // HOOK 4: Menutup browser setelah semua test
    after(async function () {
        if (driver) {
            await driver.quit();
        }
    });
});
