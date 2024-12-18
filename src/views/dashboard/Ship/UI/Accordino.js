// ** React Imports
import { useState } from "react";

// ** Reactstrap Imports
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";

const AccordionMargin = () => {
  // ** State

  const [open, setOpen] = useState("");

  const toggle = (id) => {
    open === id ? setOpen() : setOpen(id);
  };

  return (
    <>
      <Accordion className="accordion-margin" open={open} toggle={toggle}>
        <AccordionItem>
          <AccordionHeader targetId="1">
            Puffs ‘n’ Rolls bring you the opportunity to start your own business
            with high returns on investment!
          </AccordionHeader>
          <AccordionBody accordionId="1">
            Puffs ‘n’ Rolls -The Bake Shop, established in 2001, prides itself
            on being Nashik’s leading Manufacturer of Bakery & Confectionery
            products. It creates custom baked goodies for any social celebration
            or business occasion. The business has grown successfully over the
            years and this is primarily due to the quality of the products and
            to the excellent service offered to all the customers. This
            philosophy is to be underpinned by establishing and maintaining
            strong working relationships with our suppliers, customers and
            caring for our staff to work towards a common goal of mutual
            profitability, based on Trust & Respect. Puffs ‘n’ Rolls offers a
            full range of Bakery & Confectionery products which includes Puffs,
            Pizzas, Burgers, Sandwiches, Rolls, Croissants, Health Breads,
            Cookies, Tea Time Cakes, Muffins, Cup Cakes, Brownies, Occasional
            Cakes, and Desserts.
          </AccordionBody>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader targetId="2">
            Reasons to start a Bakery
          </AccordionHeader>
          <AccordionBody accordionId="2">
            "Faster Turnover.", "Bakeries / Café experience higher table
            turnover rates than other restaurants. This means that you can serve
            more customers with fewer square feet of restaurant space.",
            "Successful bakeries offer a wide assortment for their customers.
            However, from an ingredients standpoint, it’s easier for a bakery to
            buy bulk (to purchase mass quantities of food products). As a result
            of scale pricing, a startup bakery has an advantage of costs over
            other restaurants in the local market.", "Bakeries operate with
            little or no wait staff.", "The main advantage of a bakery / café is
            that it has an individual approach to the customer. Demand will
            constantly increase."
          </AccordionBody>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader targetId="3">
            Desired franchise profile
          </AccordionHeader>
          <AccordionBody accordionId="3">
            "Leadership experience in related field.", "A track record of
            success in providing the highest level of customer service &
            satisfaction in business.", "The commitment and resources essential
            to market & represent our products to a swiftly expanding and
            diverse customer population.", "Entrepreneurial excellence with zeal
            to become successful."
          </AccordionBody>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader targetId="4">Franchisee Facts</AccordionHeader>
          <AccordionBody accordionId="4">
            "Area Required: 1000 to 1500 sq feet.", "For more details please
            contact us."
          </AccordionBody>
        </AccordionItem>

        <AccordionItem>
          <AccordionHeader targetId="5">Support Offered"</AccordionHeader>
          <AccordionBody accordionId="5">
            "Site selection assistance is provided to the franchisee.",
            "Franchise training will be provided in Nashik.", "Field assistance
            is also available for the franchisee.", "Experts from Head Office
            will support the franchisee in setting up and sourcing trained
            staff."
          </AccordionBody>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader targetId="6">
            Benefits Franchise Gets
          </AccordionHeader>
          <AccordionBody accordionId="6">
            "A reputed brand name & logo to use.", "A trusted business model to
            follow.", "Great returns on investment."
          </AccordionBody>
        </AccordionItem>
      </Accordion>
    </>
  );
};
export default AccordionMargin;
