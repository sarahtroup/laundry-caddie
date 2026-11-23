# Subscription and by-the-pound test review

Open `signup-test.html` from a local or branch preview. The page uses the existing branding and pricing cards and has no incoming links from the public site. The current Arc signup and Square gift card links stay in place until the replacement is reviewed and approved.

The [care standards draft](care-standards-draft.html) is for review. After approval, archive the approved version and have each checkout or form identify the exact sections that apply. Residential subscriptions and residential by-the-pound requests share the residential care instructions and have separate service terms. Occasional commercial orders use the by-the-pound form at $2/lb. Commercial orders above 100 lb in a month and ongoing commercial service go to a quote. Staff review order size and capacity before confirming a pickup.

## Stripe Checkout

1. In a Stripe sandbox, create two Payment Links for the Regular Blue Bag ($155/month) and XL Orange Bag ($185/month). Add a required monthly service-fee price as a second line item on each link. If the separate fee cannot be used, use flat recurring prices of $159 and $189 and update the preview pricing copy at the same time. Verify both the first charge and recurring invoice total.
2. Enable native name, email, phone and shipping-address collection. Use Stripe’s shipping address as the pickup address and label it as such in Checkout’s address guidance. Require terms of service consent. Use the approved, immutable care standards page as the Stripe terms URL where account settings allow. If Stripe is shared with other programs, check the scope of that setting first. Use link metadata for the care standards version and archived URL and display the same version in Checkout. Create a new link for each standards version and retire the old one.
3. Put the two `https://buy.stripe.com/test_…` URLs in `signup-test.js`. For each plan, try completing Checkout without accepting the standards. Then complete it with a test card and check the contact details, pickup address, payment and subscription in Stripe.
4. Inspect the completed Checkout Session and the `checkout.session.completed` event. Record the session ID, accepted consent, version and archive URL from link metadata, and the event creation timestamp as the completed-checkout acceptance record. Check the Dashboard record, customer receipt and invoice PDF. Stripe documents printable receipts and a session consent status. Its receipt docs do not document inclusion of the exact accepted text, version and date. Test-mode receipts can be sent manually.
5. For the pilot, use the completed session and archived care standards to build a printable agreement with the full text, version and acceptance date. Save that copy in restricted storage for Laundry Caddie and provide the same PDF to the customer with the pickup confirmation if the Stripe documents lack any of those fields. The completed Checkout event is the source of the date. A page visit, redirect or subscription renewal is insufficient. Validate the agreement against a real sandbox event before relying on this procedure.

[Payment Link settings](https://docs.stripe.com/payment-links/customize) · [Checkout Session](https://docs.stripe.com/api/checkout/sessions/object) · [Stripe receipts](https://docs.stripe.com/receipts)

## Microsoft Forms, SharePoint and invoices

- In the Arc-owned test form, put **Are you a commercial customer?** first. Branch **No** directly to Residential pickup. Branch **Yes** to Commercial eligibility. Keep any test-only instruction in the form description.
- In Commercial eligibility, ask **Is this for ongoing service or more than 100 lb per month?** Route **Yes** to a quote section with `laundrycaddie@arcjacksonville.org` and end that path without a pickup request. Route **No** to Occasional commercial pickup. Collect business name, linen type and estimated monthly weight only there. Each pickup section ends at Submit so it cannot fall through to another service's questions.
- In each pickup section, require separate **First name**, **Last name**, **Email**, **Phone number**, **Street address**, **City**, **State**, and **ZIP code** questions. Apartment or unit and pickup instructions are optional. Microsoft Forms uses text boxes for these fields, including phone and address. Keep phone and ZIP as text so punctuation and leading zeros are preserved.
- Show **Thursday (laundry by the pound only)** as the pickup day and use a required single-choice field to confirm it. Display the full applicable care standards in the section subtitle or agreement question subtitle immediately before a required **I have read and agree** choice. Label the agreement with the archived version. The Word starter import cannot configure this branching or required settings.

### Text to display before residential agreement

We wash clothes, sheets, and towels with fragrance-free, hypoallergenic detergent. We add a color-catcher sheet and detergent booster to every load. We use the same wash and dry process for all items and dry on medium heat. Please keep delicates and specialty-care items at home.

Before pickup, empty pockets and pre-treat stubborn stains if needed. Send your preferred detergent if you’d like us to use it, and include hangers for any garments you’d like returned hanging. Please keep out items soiled with any of the “Three P’s” (pee, poop, or puke).

We’ll email you to confirm your pickup time. Thursday pickup is available for by-the-pound service. We weigh your laundry after pickup and send a Stripe invoice based on the measured weight.

### Text to display before occasional commercial agreement

We wash commercial linens in commercial washers and dryers using gentle-on-skin, professional-grade detergent, sanitizer, and oxygen bleach. We can customize products to your needs.

Occasional commercial orders are $2/lb. Use the by-the-pound form to request a pickup. For more than 100 lb in a month or for ongoing service, request a quote so we can confirm volume, pickup needs, and pricing.

We’ll email you to confirm your pickup time. Thursday pickup is available for by-the-pound service. We weigh your laundry after pickup and send a Stripe invoice based on the measured weight.

### Tracking and testing

- Enable print/download after submission. Open the linked Excel workbook from the group form and verify staff-only permissions in SharePoint. Track pickup date, weight, Stripe invoice ID and payment status in a separate staff tracker keyed by response ID.
- Microsoft’s built-in receipt email is available to internal respondents. Use Power Automate’s Forms submission trigger, Get response details and an Outlook send action to send outside customers a printable copy with their answers, the exact applicable care standards text and version, and the submission date. Use a designated test inbox and sample data. Staff send the pickup confirmation after scheduling.
- Copy the iframe source from **Collect responses → Embed** into `microsoftFormsEmbedUrl` in `signup-test.js`. Test the embed and fallback link signed out, required agreement, print/download, external receipt delivery, and the linked workbook row. Check that an outside user cannot access the workbook.
- After weighing, send a Stripe test invoice with the measured weight and applicable rate. Verify $2/lb for an occasional commercial order.

[Microsoft Forms embedding](https://support.microsoft.com/en-us/forms/share-a-form) · [Response copies](https://support.microsoft.com/en-us/forms/print-or-download-a-receipt-of-responses) · [Forms and Excel](https://support.microsoft.com/en-us/forms/microsoft-forms-and-excel-workbooks) · [Power Automate](https://learn.microsoft.com/en-us/power-automate/forms/how-to)

### Pickup confirmation email

**Subject** Laundry Caddie pickup confirmed

Hi [first name],

Your [weekly / by-the-pound] pickup is confirmed for [date] during [pickup window] at [pickup address]. Please leave your laundry [agreed placement instructions].

[By the pound: We’ll email your Stripe invoice after we weigh your laundry.]

[Subscription: Your care standards agreement is attached, including the version and date you accepted it.]

If you need to make a change, reply to this email or call 904-779-3136.

Laundry Caddie

## Gift Up test

Gift Up’s Stripe payment connection and its Stripe Checkout & Billing coupon integration are separate. Verify an isolated Gift Up test setup and Stripe sandbox before connecting or entering any codes.

- Configure $50, $100, $155, $185 and a custom amount. Check that all five choices appear. Place a $50 test order and one custom-amount order. Verify delivery and starting balances.
- For the same Stripe test customer, create a $30 by-the-pound draft invoice. Apply the $50 code to that invoice and check the discount, finalized invoice balance, Gift Up balance and Stripe customer credit. Gift Up documents that the remaining $20 transfers to the Stripe customer balance for invoice redemption. Verify it is available only once by checking both ledgers and applying the credit to a second $25 test invoice, leaving $5 payable. Record the invoice IDs and observed balances in the draft review without customer details or full gift card codes.
- If test cards cannot sync into Stripe’s sandbox, record that limitation and keep the Square link. Keep the Square link until partial redemption has been verified and the replacement is approved.

[Gift Up test orders](https://help.giftup.com/article/77-how-to-place-a-test-order) · [Stripe coupon and invoice behavior](https://help.giftup.com/article/188-stripe-subscriptions-coupons)
