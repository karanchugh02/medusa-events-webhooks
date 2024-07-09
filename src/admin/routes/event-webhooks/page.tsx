import { RouteConfig, RouteProps } from "@medusajs/admin";
import { ToolsSolid } from "@medusajs/icons";
import { Table, Button, Switch, FocusModal, Input } from "@medusajs/ui"; // Adjust the import based on the actual UI library
import axios from "axios";
import { useState, useEffect } from "react";
import EventWebhooksModal from "../../components/event-types-modal";

const EventWebhooksPage = ({ notify }: RouteProps) => {
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventsModal, setEventsModal] = useState({ opened: false, id: "" });
  const [refreshCount, setRefreshCount] = useState(0);
  const [webhookModal, setWebhookModal] = useState({
    opened: false,
    webhook_url: "",
  });

  const handleToggle = async (id, isActive) => {
    try {
      // Implement the API call to update the active status of the webhook
      await axios.post(
        `${
          process.env.MEDUSA_ADMIN_BACKEND_URL || ""
        }/custom/update-webhook-status`,
        {
          id,
          active: isActive,
        }
      );
      setWebhooks((prevWebhooks) =>
        prevWebhooks.map((webhook) =>
          webhook.id === id ? { ...webhook, active: isActive } : webhook
        )
      );

      notify.success("Updated", "Webhook updated successfully");
    } catch (error) {
      notify.error("Failed", "Failed to update webhook status");
    }
  };

  const handleWebhookSave = async () => {
    let res = await axios.post(
      `${process.env.MEDUSA_ADMIN_BACKEND_URL || ""}/custom/register-webhook`,
      {
        webhook_url: webhookModal.webhook_url,
        event_types: [],
      }
    );

    if (res.data.status == true) {
      setRefreshCount(refreshCount + 1);
      setWebhookModal({ opened: false, webhook_url: "" });
      notify.success("Webhook created", "Webhook created successfully");
    } else {
      notify.error("Failed", res.data.message);
    }
  };

  useEffect(() => {
    const fetchWebhooks = async () => {
      try {
        const response = await axios.get(
          `${
            process.env.MEDUSA_ADMIN_BACKEND_URL || ""
          }/custom/get-event-webhooks`,
          { withCredentials: true }
        );
        setWebhooks(response.data.data);
      } catch (error) {
        console.error("Error fetching webhooks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWebhooks();
  }, [refreshCount]);

  return (
    <>
      <div>
        <div className="flex flex-row justify-between items-center px-2 py-4">
          <h1 className="text-xl">Event Webhooks</h1>
          <Button
            onClick={() => setWebhookModal({ opened: true, webhook_url: "" })}
          >
            Add Webhook
          </Button>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="border-[0.5px] rounded-sm border-black">
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Webhook URL</Table.HeaderCell>
                      <Table.HeaderCell>Events</Table.HeaderCell>
                      <Table.HeaderCell>Active</Table.HeaderCell>
                      <Table.HeaderCell>Created At</Table.HeaderCell>
                      <Table.HeaderCell>Updated At</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {webhooks.map((webhook) => (
                      <Table.Row key={webhook.id}>
                        <Table.Cell>{webhook.webhook_url}</Table.Cell>
                        <Table.Cell>
                          <Button
                            onClick={() =>
                              setEventsModal({ opened: true, id: webhook.id })
                            }
                            size="small"
                          >
                            View {webhook.event_types.length}
                          </Button>
                        </Table.Cell>
                        <Table.Cell>
                          <Switch
                            checked={webhook.active}
                            style={{
                              background: webhook.active ? "black" : "gray",
                            }}
                            onCheckedChange={(checked) =>
                              handleToggle(webhook.id, checked)
                            }
                          />
                        </Table.Cell>
                        <Table.Cell>
                          {new Date(webhook.created_at).toLocaleString()}
                        </Table.Cell>
                        <Table.Cell>
                          {new Date(webhook.updated_at).toLocaleString()}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>
            )}
          </div>
        )}
      </div>

      <EventWebhooksModal
        id={eventsModal.id}
        selectedEvents={
          (webhooks.find((w) => w.id === eventsModal.id) &&
            webhooks.find((w) => w.id === eventsModal.id)?.event_types) ||
          []
        }
        setSelectedEvents={(events) => {
          let updatedWebhooks = webhooks.map((a) => {
            if (a.id == eventsModal.id) {
              return { ...a, event_types: events };
            }
            return a;
          });
          setWebhooks(updatedWebhooks);
        }}
        isOpen={eventsModal.opened}
        setOpen={(value) => setEventsModal({ opened: value, id: "" })}
        refreshCount={refreshCount}
        setRefreshCount={setRefreshCount}
        notify={notify}
      />

      <FocusModal
        open={webhookModal.opened}
        modal={true}
        onOpenChange={(open) => {
          setWebhookModal({ ...webhookModal, opened: open });
        }}
      >
        <FocusModal.Content className="!h-[25%] !max-h-[25%] !w-[25%] !max-w-[25%] absolute top-[37.5%] left-[37.5%] overflow-y-scroll">
          <FocusModal.Header className="text-center">
            <div className="w-full text-left px-2 text-xl">Add New Webhook</div>
          </FocusModal.Header>
          <FocusModal.Body className="px-3 py-5">
            <div className="flex flex-col space-y-1">
              <label>Webhook URL</label>
              <Input
                type="url"
                value={webhookModal.webhook_url}
                placeholder="https://example.com"
                onChange={(e) => {
                  setWebhookModal({
                    ...webhookModal,
                    webhook_url: e.target.value,
                  });
                }}
              />
            </div>
            <div className="flex flex-row space-x-3 justify-end items-center pt-4">
              <Button
                onClick={() => {
                  setWebhookModal({ opened: false, webhook_url: "" });
                }}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleWebhookSave();
                }}
                variant="primary"
              >
                Save
              </Button>
            </div>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>
    </>
  );
};

export const config: RouteConfig = {
  link: {
    label: "Event Webhooks",
    icon: ToolsSolid,
  },
};

export default EventWebhooksPage;
