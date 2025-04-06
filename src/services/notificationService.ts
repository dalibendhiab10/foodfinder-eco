import { supabase } from "@/integrations/supabase/client";

export const fetchNotifications = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

export const markNotificationAsRead = async (userId: string, notificationId: string) => {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId)
      .eq("user_id", userId);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

export const subscribeToNotificationChanges = (userId: string, onInsert: () => void, onUpdate: () => void) => {
  const channel = supabase
    .channel("public:notifications")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      onInsert
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      onUpdate
    )
    .subscribe();

  return channel;
};

export const unsubscribeFromNotificationChanges = (channel: any) => {
  supabase.removeChannel(channel);
};
