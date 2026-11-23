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

- Create a test form owned by a restricted Laundry Caddie Microsoft 365 group. Enable **Anyone can respond** if The Arc permits external responses. Collect name, email, phone, pickup address, preferred pickup day and optional notes. Offer Monday through Thursday for by-the-pound pickup only.
- Use separate sections for residential and occasional commercial requests. For commercial requests, collect business name, linen type, estimated monthly weight and whether service is ongoing. Route more than 100 lb per month or ongoing service to a quote. Require affirmative agreement to the applicable care standards section and record the archived version in the answer. Use a new versioned form when the standards change.
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
