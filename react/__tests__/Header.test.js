import React from 'react'

import { render } from '../testUtils'
import Header from '../components/Header'
import Warnings from '../components/Header/Warnings'
import { orderGroupQuery as oneDelivery } from '../mocks/oneDeliverySimple'
import { orderGroupQuery as onePickup } from '../mocks/onePickupSimple'
import { orderGroupQuery as splitOrder } from '../mocks/splitOrderTwoSellers'
import { orderGroupQuery as bankInvoiceDueDate } from '../mocks/bankInvoiceLoggedIn'
import { orderGroupQuery as bankInvoiceNumber } from '../mocks/bankInvoiceNumberLoggedIn'
import { orderGroupQuery as bankInvoiceNoDueDate } from '../mocks/bankInvoice'
import { orderGroupQuery as deliveryAndPickup } from '../mocks/pickupAndDelivery'

describe('Confirmation messages', () => {
  it('should render success icon', () => {
    const { getByTestId } = render(
      <Header
        data={oneDelivery.orderGroup}
        profile={oneDelivery.orderGroup[0].clientProfileData}
      />
    )

    const icon = getByTestId('sucessIcon')
    expect(icon).toBeDefined()
  })

  it('should render thank you message', () => {
    const { getByText } = render(
      <Header
        data={oneDelivery.orderGroup}
        profile={oneDelivery.orderGroup[0].clientProfileData}
      />
    )

    const thankYouMessage = getByText(/Thanks for the purchase!/)
    expect(thankYouMessage.textContent).toBeDefined()
  })
})

describe('Warnings', () => {
  it('should render payment confirmation estimate', () => {
    const { getByText } = render(<Warnings data={oneDelivery.orderGroup} />)

    const paymentApproval = getByText(
      /Payment approval may take up to \d bussiness days/i
    )
    expect(paymentApproval).toBeDefined()
  })

  it('should render shipping estimate disclaimers if order has shipping items', () => {
    const { getByText } = render(<Warnings data={oneDelivery.orderGroup} />)

    const paymentDisclaimer = getByText(
      'The delivery period starts from the moment your payment is confirmed'
    )
    const trackingDisclaimer = getByText(
      'When your order is on its way, a traking code will be sent to your email'
    )

    expect(paymentDisclaimer).toBeDefined() &&
      expect(trackingDisclaimer).toBeDefined()
  })

  it('should not render shipping estimate disclaimers if order has no shipping items', () => {
    const { queryByText } = render(<Warnings data={onePickup.orderGroup} />)

    const paymentDisclaimer = queryByText(
      'The delivery period starts from the moment your payment is confirmed'
    )
    const trackingDisclaimer = queryByText(
      'When your order is on its way, a traking code will be sent to your email'
    )

    expect(paymentDisclaimer).toBeNull() &&
      expect(trackingDisclaimer).toBeNull()
  })

  it('should render pickup estimate disclaimer if order has pickup items', () => {
    const { getByText } = render(<Warnings data={onePickup.orderGroup} />)

    const paymentDisclaimer = getByText(
      'The store pickup period starts from the moment your payment is confirmed'
    )

    expect(paymentDisclaimer).toBeDefined()
  })

  it('should not render pickup estimate disclaimers if order has no pickup items', () => {
    const { queryByText } = render(<Warnings data={oneDelivery.orderGroup} />)

    const paymentDisclaimer = queryByText(
      'The store pickup period starts from the moment your payment is confirmed'
    )

    expect(paymentDisclaimer).toBeNull()
  })

  it('should render disclaimer for split orders', () => {
    const { queryByText } = render(<Warnings data={splitOrder.orderGroup} />)

    const splitOrderDisclaimer = queryByText(
      /Your purchase was split into \d orders as some of the items were sold by partners. This does not affect shipping estimates/
    )
    expect(splitOrderDisclaimer).toBeDefined()
  })

  it('should render warning for bank invoices with due date', () => {
    const { queryByText } = render(
      <Warnings data={bankInvoiceDueDate.orderGroup} />
    )

    const bankInvoiceWarning = queryByText(
      /Please make a payment of \d+ up to \d{1,2}\/\d{1,2}\/\d{4} according to the data below/
    )
    expect(bankInvoiceWarning).toBeDefined()
  })

  it('should render warning for bank invoices without due date', () => {
    const { queryByText } = render(
      <Warnings data={bankInvoiceNoDueDate.orderGroup} />
    )

    const bankInvoiceWarning = queryByText(
      /Please make a payment of \d+ up to the due date according to the data below/
    )
    expect(bankInvoiceWarning).toBeDefined()
  })
})

describe('Purchase summary', () => {
  it('should render summary when that are shippings and store pickups in the same purchase', () => {
    const { getByTestId } = render(
      <Header
        data={deliveryAndPickup.orderGroup}
        profile={deliveryAndPickup.orderGroup[0].clientProfileData}
      />
    )

    const summaryPageBlock = getByTestId('summary')

    expect(summaryPageBlock).toBeDefined()
  })
})

describe('Bank Invoice details', () => {
  it('should render bank invoice details if present in payment methods (with url)', () => {
    const { getByTestId } = render(
      <Header
        data={bankInvoiceDueDate.orderGroup}
        profile={bankInvoiceDueDate.orderGroup[0].clientProfileData}
      />
    )
    const bankInvoiceInfo = getByTestId('bank-invoice-info')
    expect(bankInvoiceInfo).toBeDefined()
  })

  it('should render bank invoice barcode number when available', () => {
    const { getByTestId } = render(
      <Header
        data={bankInvoiceNumber.orderGroup}
        profile={bankInvoiceNumber.orderGroup[0].clientProfileData}
      />
    )
    const bankInvoiceInfo = getByTestId('bank-invoice-info')
    const bankInvoiceBarCode = getByTestId('bank-invoice-barcode')
    expect(bankInvoiceInfo).toContainElement(bankInvoiceBarCode)
  })
})