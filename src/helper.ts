const { createApolloFetch } = require("apollo-fetch");

export const fetchEpodServer = createApolloFetch({
  uri: "http://localhost:4000/graphql",
});

export const completeReportCustomer = (customer: any, deliveries: any) => {
  return customer.map((c) => {
    let completeCount = 0;
    let pendingCount = 0;
    deliveries
      .filter((x: any) => x.customer.name === c)
      .map((d: any) => {
        if (d.delvStatus === "Complete") {
          completeCount = completeCount + 1;
        } else {
          pendingCount = pendingCount + 1;
        }
      });
    return {
      customer: c,
      completed: completeCount,
      pending: pendingCount,
    };
  });
};

export const varianceReportCustomer = (customer: any, deliveries: any) => {
  return customer.map((customer) => {
    return deliveries
      .filter((del: any) => del.customer.name === customer)
      .filter((del: any) => del.delvStatus === "Complete")
      .map((del: any) => {
        let variance = 0;
        del.items.map((item: any) => {
          const convertVariance = (variance: number, qty: number) => {
            console.log(variance);

            if (variance < 0) {
              return variance * -1;
            }
            if (variance > 0) {
              return variance * -1;
            }

            return variance;
          };
          const qty = item.qty;
          const varianceQty = convertVariance(item.varianceQty, item.qty) || 0;
          const newVariance = (varianceQty / qty) * 100;

          variance = variance + newVariance;
        });
        console.log(del.items.length);
        variance = variance != 0 ? variance / del.items.length : 0;
        return {
          delivery: del.id,
          variance: variance,
          customer: customer,
        };
      });
  });
};

export const completeReportShipment = (
  shipmentNumber: Array<String>,
  deliveries: any
) => {
  return shipmentNumber.map((s) => {
    let completeCount = 0;
    let pendingCount = 0;
    deliveries
      .filter((x: any) => x.shipmentNumber === s)
      .map((d: any) => {
        if (d.delvStatus === "Complete") {
          completeCount = completeCount + 1;
        } else {
          pendingCount = pendingCount + 1;
        }
      });
    return {
      shipment: s,
      completed: completeCount,
      pending: pendingCount,
    };
  });
};

export const varianceReportShipment = (
  shipmentNumber: Array<String>,
  deliveries: any
) => {
  return shipmentNumber.map((shipment) => {
    return deliveries
      .filter((del: any) => del.shipmentNumber === shipment)
      .filter((del: any) => del.delvStatus === "Complete")
      .map((del: any) => {
        let variance = 0;
        del.items.map((item: any) => {
          const convertVariance = (variance: number, qty: number) => {
            console.log(variance);

            if (variance < 0) {
              return variance * -1;
            }
            if (variance > 0) {
              return variance * -1;
            }

            return variance;
          };
          const qty = item.qty;
          const varianceQty = convertVariance(item.varianceQty, item.qty) || 0;
          const newVariance = (varianceQty / qty) * 100;

          variance = variance + newVariance;
        });
        console.log(del.items.length);
        variance = variance != 0 ? variance / del.items.length : 0;
        return {
          delivery: del.id,
          variance: variance,
          shipment: shipment,
        };
      });
  });
};

export const fetchDelivery = async () => {
  return await fetchEpodServer({
    query: `query{
            allDeliverys{
              id
              scheduledDate
              scheduledTime
              delvStatus
              driver{
                id
                name
                plateNumber
              }
              items{
                id
                itemNumber
                material
                pricePerUnit
                uom
                qty
                varianceQty
                pricePerUnit
                deliveryDateAndTime
              }
              customer{
                id
                name
                address{
                  id
                  building_name
                  street
                  city
                  state
                  street
                  zip_code
                }
              }
              shipmentNumber
              file{
                 id
                path
              }
              trucker
            }
          }`,
    variables: {},
  }).then((res: any) => {
    return res.data;
  });
};