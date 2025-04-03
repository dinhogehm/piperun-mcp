/**
 * Funções utilitárias para formatação de dados
 */

/**
 * Formata um valor monetário para o formato de moeda brasileira (R$)
 * @param value Valor a ser formatado
 * @returns String formatada como moeda
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

/**
 * Formata uma data para o formato brasileiro (DD/MM/YYYY)
 * @param date Data a ser formatada
 * @returns String formatada como data
 */
export function formatDate(date: string | Date): string {
  if (!date) return 'N/A';
  
  return new Date(date).toLocaleDateString('pt-BR');
}

/**
 * Trunca um texto longo para exibição resumida
 * @param text Texto a ser truncado
 * @param maxLength Tamanho máximo do texto
 * @returns Texto truncado com reticências
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
}

/**
 * Formata um número de telefone para exibição
 * @param phone Número de telefone a ser formatado
 * @returns Número de telefone formatado
 */
export function formatPhone(phone: string): string {
  if (!phone) return 'N/A';
  
  // Remove caracteres não numéricos
  const numbers = phone.replace(/\D/g, '');
  
  // Formata o telefone de acordo com a quantidade de dígitos
  if (numbers.length === 11) {
    // Celular com DDD (11 dígitos)
    return numbers.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
  } else if (numbers.length === 10) {
    // Telefone fixo com DDD (10 dígitos)
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (numbers.length === 9) {
    // Celular sem DDD (9 dígitos)
    return numbers.replace(/(\d{1})(\d{4})(\d{4})/, '$1 $2-$3');
  } else if (numbers.length === 8) {
    // Telefone fixo sem DDD (8 dígitos)
    return numbers.replace(/(\d{4})(\d{4})/, '$1-$2');
  }
  
  // Caso não seja um dos formatos acima, retorna o número original
  return phone;
}
