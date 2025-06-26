export interface OrderRequest {
  MessageBody: {
    cliente_name: string; // Fixed: API expects 'cliente_name', not 'client_name'
    hamburguer_description: string;
  };
  MessageGroupId: string;
}

export interface OrderData {
  clientName: string;
  hamburguerDescription: string;
}