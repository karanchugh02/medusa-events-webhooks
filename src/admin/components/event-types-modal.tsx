import React, { useState } from "react";
import { FocusModal, Button, Switch, Heading, Text } from "@medusajs/ui"; // Adjust the import based on the actual UI library
import axios from "axios";
const allEvents = [
  "order.gift_card_created",
  "order.payment_captured",
  "order.payment_capture_failed",
  "order.shipment_created",
  "order.fulfillment_created",
  "order.fulfillment_canceled",
  "order.return_requested",
  "order.items_returned",
  "order.return_action_required",
  "order.refund_created",
  "order.refund_failed",
  "order.swap_created",
  "order.placed",
  "order.updated",
  "order.canceled",
  "order.completed",
  "cart.customer_updated",
  "cart.created",
  "cart.updated",
  "payment.created",
  "payment.updated",
  "payment.payment_captured",
  "payment.payment_capture_failed",
  "payment.payment_refund_created",
  "payment.payment_refund_failed",
  "customer.password_reset",
  "customer.created",
  "customer.updated",
];

const groupEventsByOuter = (events) => {
  return events.reduce((acc, event) => {
    const [outer, inner] = event.split(".");
    if (!acc[outer]) {
      acc[outer] = [];
    }
    acc[outer].push(inner);
    return acc;
  }, {});
};

const EventWebhooksModal = ({
  id,
  isOpen,
  setOpen,
  selectedEvents,
  setSelectedEvents,
  setRefreshCount,
  refreshCount,
  notify,
}) => {
  const eventsGroupedByOuter = groupEventsByOuter(allEvents);

  const handleOuterToggle = (outer, isSelected) => {
    const updatedEvents = isSelected
      ? [
          ...new Set([
            ...selectedEvents,
            ...eventsGroupedByOuter[outer].map((inner) => `${outer}.${inner}`),
          ]),
        ]
      : selectedEvents.filter((event) => !event.startsWith(`${outer}.`));
    setSelectedEvents(updatedEvents);
  };

  const handleInnerToggle = (event, isSelected) => {
    const updatedEvents = isSelected
      ? [...new Set([...selectedEvents, event])]
      : selectedEvents.filter((e) => e !== event);
    setSelectedEvents(updatedEvents);
  };

  const onSave = async () => {
    let res = await axios.post(
      `${process.env.MEDUSA_ADMIN_BACKEND_URL}/custom/update-webhook-events`,
      { id, event_types: selectedEvents },
      { headers: { "Content-type": "application/json" } }
    );

    if (res.data.status == true) {
      setRefreshCount(refreshCount + 1);
      setOpen(false);
      notify.success("Updated", "Events updated successfully");
    } else {
      notify.error("Failed", res.data.message);
    }
  };

  return (
    <FocusModal
      open={isOpen}
      modal={true}
      onOpenChange={(open) => {
        setRefreshCount(refreshCount + 1);
        setOpen(open);
      }}
    >
      <FocusModal.Content className="!h-[50%] !max-h-[50%] !w-[50%] !max-w-[50%] absolute top-[25%] left-[25%] overflow-y-scroll">
        <FocusModal.Header className="text-center">
          <div className="w-full text-center text-xl">Edit Event Types</div>
        </FocusModal.Header>
        <FocusModal.Body className="px-3 py-5">
          {Object.keys(eventsGroupedByOuter).map((outer) => (
            <div key={outer}>
              <div className="flex items-center space-x-3">
                <span className="text-lg font-semibold">{outer}</span>
                <Switch
                  checked={eventsGroupedByOuter[outer].every((inner) =>
                    selectedEvents.includes(`${outer}.${inner}`)
                  )}
                  style={{
                    background: eventsGroupedByOuter[outer].every((inner) =>
                      selectedEvents.includes(`${outer}.${inner}`)
                    )
                      ? "black"
                      : "gray",
                  }}
                  onCheckedChange={(checked) =>
                    handleOuterToggle(outer, checked)
                  }
                />
              </div>
              <div className="py-4 grid grid-cols-3 gap-3">
                {eventsGroupedByOuter[outer].map((inner) => (
                  <div
                    key={inner}
                    className="flex items-center justify-between"
                  >
                    <Text>{inner}</Text>
                    <Switch
                      checked={selectedEvents.includes(`${outer}.${inner}`)}
                      style={{
                        background: selectedEvents.includes(`${outer}.${inner}`)
                          ? "black"
                          : "gray",
                      }}
                      onCheckedChange={(checked) =>
                        handleInnerToggle(`${outer}.${inner}`, checked)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex flex-row space-x-3 justify-end items-center pt-4">
            <Button
              onClick={() => {
                setOpen(false);
                setRefreshCount(refreshCount + 1);
              }}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button onClick={() => onSave()} variant="primary">
              Save
            </Button>
          </div>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
};

export default EventWebhooksModal;
