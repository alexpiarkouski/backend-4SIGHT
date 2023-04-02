import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const article = req.body.article || '';
  console.log(article);
  console.log("test");

  if (article.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid article",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(article),
      // temperature: 0.6,
      temperature: 0.95,
      max_tokens: 300,
      top_p: 1,
      frequency_penalty: 0.2,
      presence_penalty: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(article) {
  const capitalizedAnimal =
    article[0].toUpperCase() + article.slice(1).toLowerCase();
  return `Below is an article to identify key topics from articles and structure the topics weighted by importance, provide keywords to facilitate learning for university finance students. Establish pair relationships between major and minor concepts. For each major concept list minor concepts directly related to it. 

Article: Understanding Bond Valuation
A bond is a debt instrument that provides a steady income stream to the investor in the form of coupon payments. At the maturity date, the full face value of the bond is repaid to the bondholder. The characteristics of a regular bond include:

* Coupon rate: Some bonds have an interest rate, also known as the coupon rate, which is paid to bondholders semi-annually. The coupon rate is the fixed return that an investor earns periodically until it matures.
* Maturity date: All bonds have maturity dates, some short-term, others long-term. When a bond matures, the bond issuer repays the investor the full face value of the bond. For corporate bonds, the face value of a bond is usually $1,000 and for government bonds, the face value is $10,000. The face value is not necessarily the invested principal or purchase price of the bond.
* Current price: Depending on the level of interest rate in the environment, the investor may purchase a bond at par, below par, or above par. For example, if interest rates increase, the value of a bond will decrease since the coupon rate will be lower than the interest rate in the economy. When this occurs, the bond will trade at a discount, that is, below par. However, the bondholder will be paid the full face value of the bond at maturity even though he purchased it for less than the par value.1
* 
Bond Valuation in Practice
Since bonds are an essential part of the capital markets, investors and analysts seek to understand how the different features of a bond interact in order to determine its intrinsic value. Like a stock, the value of a bond determines whether it is a suitable investment for a portfolio and hence, is an integral step in bond investing.

Bond valuation, in effect, is calculating the present value of a bond's expected future coupon payments. The theoretical fair value of a bond is calculated by discounting the future value of its coupon payments by an appropriate discount rate. The discount rate used is the yield to maturity, which is the rate of return that an investor will get if they reinvested every coupon payment from the bond at a fixed interest rate until the bond matures. It takes into account the price of a bond, par value, coupon rate, and time to maturity.

$3.9 trillion
The size of the U.S. municipal bond market, or the total amount of debt outstanding, at the end of 2018, according to the Securities Industry and Financial Markets Association (SIFMA), an industry group.
2
Coupon Bond Valuation
Calculating the value of a coupon bond factors in the annual or semi-annual coupon payment and the par value of the bond.

The present value of expected cash flows is added to the present value of the face value of the bond as seen in the following formula



For example, let's find the value of a corporate bond with an annual interest rate of 5%, making semi-annual interest payments for 2 years, after which the bond matures and the principal must be repaid. Assume a YTM of 3%:

* F = $1,000 for corporate bond
* Coupon rateannual = 5%, therefore, Coupon ratesemi-annual = 5% / 2 = 2.5%
* C = 2.5% x $1000 = $25 per period
* t = 2 years x 2 = 4 periods for semi-annual coupon payments
* T = 4 periods
* r = YTM of 3% / 2 for semi-annual compounding = 1.5%

* 		Present value of semi-annual payments = 25 / (1.015)1 + 25 / (1.015)2 + 25 / (1.015)3 + 25 / (1.015)4 = 96.36
* 		Present value of face value = 1000 / (1.015)4 = 942.18

Therefore, the value of the bond is $1,038.54.

Zero-Coupon Bond Valuation
A zero-coupon bond makes no annual or semi-annual coupon payments for the duration of the bond. Instead, it is sold at a deep discount to par when issued. The difference between the purchase price and par value is the investor’s interest earned on the bond. To calculate the value of a zero-coupon bond, we only need to find the present value of the face value. Carrying over from the example above, the value of a zero-coupon bond with a face value of $1,000, YTM of 3% and 2 years to maturity would be $1,000 / (1.03)2, or $942.59.

Are Bonds Valued the Same As Stocks?
Not exactly. Both stocks and bonds are generally valued using discounted cash flow analysis—which takes the net present value of future cash flows that are owed by a security. Unlike stocks, bonds are composed of an interest (coupon) component and a principal component that is returned when the bond matures. Bond valuation takes the present value of each component and adds them together.

Why Is the Price of My Bond Different From Its Face Value?
A bond's face or par value will often differ from its market value. This has to do with several factors including changes to interest rates, a company's credit rating, time to maturity, whether there are any call provisions or other embedded options, and if the bond is secured or unsecured. A bond will always mature at its face value when the principal originally loaned is returned.

Why Are Bond Prices Inversely Related to Interest Rates?
A bond that pays a fixed coupon will see its price vary inversely with interest rates. This is because receiving a fixed interest rate, of say 5% is not very attractive if prevailing interest rates are 6%, and become even less desirable if rates can earn 7%. In order for that bond paying 5% to become equivalent to a new bond paying 7%, it must trade at a discounted price. Likewise, if interest rates drop to 4% or 3%, that 5% coupon becomes quite attractive and so that bond will trade at a premium to newly-issued bonds that offer a lower coupon.

What Is Duration and How Does That Affect Bond Valuation?
Bond valuation looks at discounted cash flows at their net present value if held to maturity. Duration instead measures a bond's price sensitivity to a 1% change in interest rates. Longer-term bonds have a higher duration, all else equal. Longer-term bonds will also have a larger number of future cash flows to discount, and so a change to the discount rate will have a greater impact on the NPV of longer-maturity bonds as well.

How Are Convertible Bonds Valued?
A convertible bond is a debt instrument that has an embedded option that allows investors to convert the bonds into shares of the company's common stock. Convertible bond valuations take a multitude of factors into account, including the variance in underlying stock price, the conversion ratio, and interest rates that could affect the stocks that such bonds might eventually become. At its most basic, the convertible is priced as the sum of the straight bond and the value of the embedded option to convert.


Summary: Major Concept: Bond Characteristics
Minor Concepts:
1. Coupon rate
2. Maturity date
3. Current price
 
Major Concept: Bond Valuation
Minor Concepts:
1. Present value
2. Yield to maturity
3. Discount rate
4. Future value
5. Intrinsic value
 
Major Concept: Coupon Bond Valuation
Minor Concepts:
1. Cash flows
2. Par value
3. Annual or semi-annual coupon payment
4. Yield to maturity (YTM)

Major Concept: Zero-Coupon Bond Valuation
Minor Concepts:
1. Face value
2. Deep discount
3. Interest earned

Major Concept: Differences between Bond Valuation and Stock Valuation
Minor Concepts:
1. Discounted cash flow analysis
2. Coupon component
3. Principal component

Major Concept: Factors Affecting Bond Price
Minor Concepts:
1. Changes in interest rates
2. Credit rating
3. Time to maturity
4. Call provisions or other embedded options
5. Secured or unsecured bond

Article: Understanding Bond Valuation

Summary:
Title: Understanding Bond Valuation
Major Concept: Bond Characteristics
Minor Concepts:
1. Coupon rate
2. Maturity date
3. Current price
 
Major Concept: Bond Valuation
Minor Concepts:
1. Present value
2. Yield to maturity
3. Discount rate
4. Future value
5. Intrinsic value
 
Major Concept: Coupon Bond Valuation
Minor Concepts:
1. Cash flows
2. Par value
3. Annual or semi-annual coupon payment
4. Yield to maturity (YTM)

Major Concept: Zero-Coupon Bond Valuation
Minor Concepts:
1. Face value
2. Deep discount
3. Interest earned

Major Concept: Differences between Bond Valuation and Stock Valuation
Minor Concepts:
1. Discounted cash flow analysis
2. Coupon component
3. Principal component

Major Concept: Factors Affecting Bond Price
Minor Concepts:
1. Changes in interest rates
2. Credit rating
3. Time to maturity
4. Call provisions or other embedded options
5. Secured or unsecured bond


Article: ${article}
Summary:`;
}
