export interface OrderRequest {
  cliente_name: string;
  hamburguer_description: string;
}

// Esta interface não precisa de mudanças, ela representa os dados do formulário.
export interface OrderData {
  clientName: string;
  hamburguerDescription: string;
}