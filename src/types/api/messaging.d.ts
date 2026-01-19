// ============ Message Types ============
interface UserBasicInfo {
  id: number;
  username: string;
  email: string;
}

interface ListingBasicInfo {
  id: number;
  title: string;
  slug: string;
}

interface LastMessage {
  id: number;
  content: string;
  created_at: string;
}

interface Conversation {
  id: number;
  listing_id: number | null;
  participant1_id: number;
  participant2_id: number;
  last_message_at: string | null;
  participant1_unread_count: number;
  participant2_unread_count: number;
  created_at: string;
  updated_at: string;
  participant1: UserBasicInfo | null;
  participant2: UserBasicInfo | null;
  listing: ListingBasicInfo | null;
  last_message: LastMessage | null;
}

interface MessageAttachment {
  id: number;
  message_id: number;
  file_upload_id: number;
  file_url: string;
  filename: string;
  file_type: string;
  created_at: string;
}

interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  sender: UserBasicInfo | null;
  attachments: MessageAttachment[];
  offer_id?: number | null; // Optional: link to offer if message is related to an offer
}

interface MessageCreateRequest {
  content: string;
}

interface ConversationCreateRequest {
  participant2_id: number;
  listing_id?: number;
}