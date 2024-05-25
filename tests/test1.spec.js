const {test, expect} = require('@playwright/test');

test('Clinet page e2e testing', async ({page})=>
{
    await page.goto('https://rahulshettyacademy.com/client/');

    // All Locators

    //Login Page Locators
    const userName = page.locator('input#userEmail');
    const password = page.locator("input[placeholder*='passsword']");
    const signIn = page.locator("input[value='Login']");

    //Product Page Locators
    const products = page.locator('div.card-body');
    const productName = "ADIDAS ORIGINAL";
    const kart = page.locator("button[routerlink*='cart']");
    const kartLoad = page.locator('div.cart li');
    const kartProduct = page.locator("h3:has-text('ADIDAS ORIGINAL')");
    const checkOut = page.locator("div[class*='subtotal'] li button");
    const validatePayment = page.locator("div.payment__title");
    // const creditCard = page.getByTitle("Credit Card Number ");
    const creditCard = await page.locator("div.field input").nth(0);
    const date1 = page.locator("select.input.ddl");
    const cvvCode = page.locator("div.field.small input").first();
    const couponCode = page.locator('div.field.small input').last();
    const applyCoupon = page.locator("button[type='submit']");
    const validateCoupon = page.locator("p[class*='ng-star-inserted']");
    const cardName = page.locator("div.field input[class*='input txt']").nth(2);
    const validateEmail = page.locator("div[class*='user__name'] label").first();
    const country = page.locator("div[class*='user__name'] input").last();
    const dropDown = page.locator("section[class*='ta-results']");
    const placeOrder = page.locator("a[class*='action__submit']");
    const orderConfirmMsg = page.locator("h1.hero-primary");
    const validateOrderId = page.locator("label.ng-star-inserted");
    const orderTab = page.locator("button[routerlink*='myorders']");
    const validateOrderPage = page.locator('h1.ng-star-inserted');
    const tableRows = page.locator("tbody tr");
    const summaryOrderId = page.locator("div[class*='col-text']");

    //Login Page Code
    const email = 'ladderkam@gmail.com';
    await userName.fill(email);
    await password.fill('Shaja@123');
    await signIn.click();
    await page.waitForLoadState('networkidle');
    //Product Page Code
    const count = await products.count();

    for(let i=0; i<count; ++i)
    {
        const pName = await products.nth(i).locator('b').textContent();
        if(await productName.includes(pName))
        {
            await products.nth(i).locator("text=' Add To Cart'").click();
            break;
        }
        
        // if(await pName === productName)
        // {
        //     // await products.nth(i).locator("text=' Add To Cart'").waitFor();
        //     await products.nth(i).locator("text=' Add To Cart'").click();
        //     break;
        // }
    }

    await kart.click();
    // Here kart page takes time for element loading so use waitFor() => here atleast one product need to be visible
    await kartLoad.first().waitFor();   // or   await kartLoad.waitFor();
    const bool = await kartProduct.isVisible();
    expect(bool).toBeTruthy();
    await checkOut.click();
    const payTitle = " Payment Method ";
    await expect(await validatePayment.first()).toContainText(payTitle);
    await creditCard.clear();
    await creditCard.fill('1234 5678 1234 2232');
    await date1.first().selectOption('05');
    await date1.last().selectOption('18');
    await cvvCode.fill('899');
    await cardName.fill('Sajayath Alikhan')
    await couponCode.fill('rahulshettyacademy');
    await applyCoupon.waitFor();
    await applyCoupon.click();
    await validateCoupon.waitFor();
    await expect(validateCoupon).toContainText('Coupon Applied');
    await expect(validateEmail).toHaveText(email);

    // Dynamic Dropdowns/Auto Suggestive Options
    await country.pressSequentially('ind');
    await dropDown.waitFor();
    const optionCount = await dropDown.locator('button').count();
    for(let i=0; i< optionCount; ++i)
    {
        const ddnOptions = await dropDown.locator('button').nth(i).textContent();
        if(ddnOptions.trim() === 'India')
        {
            await dropDown.locator('button').nth(i).click();
            break;
        }
    }

    await placeOrder.click();
    await expect(orderConfirmMsg).toHaveText(' Thankyou for the order. ');
    const orderId = await validateOrderId.textContent();
    const orderVal = orderId.split('|')[1].split('|')[0].trim();
    console.log(orderVal);

    //Order Page Code
    await orderTab.click();
    await expect(validateOrderPage).toHaveText('Your Orders');
    
    for(let i=0; i< await tableRows.count(); i++)
    {

        const actualOrderVal = await tableRows.nth(i).locator('th').textContent();
        if(await actualOrderVal.includes(orderVal))
        {
            tableRows.nth(i).locator("button[class*='btn-primary']").click();
            break;
        }
    }

    const orderIdVal = await summaryOrderId.textContent();
    expect(orderVal.includes(orderIdVal)).toBeTruthy();
    await page.pause();
});