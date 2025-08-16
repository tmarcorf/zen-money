export function formatToBRL(value: number | string): string {
    if (value === null || value === undefined) return '';
    let numericValue = typeof value === 'number'
      ? value
      : parseFloat(value.toString().replace(/\./g, '').replace(',', '.'));

    if (isNaN(numericValue)) return '';

    return numericValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
}

export function formatAmount(event: any): string {
    // Remove tudo que não for número
    let value = event.target.value.replace(/\D/g, '');

    // Converte para número com duas casas decimais
    let numericValue = (parseInt(value, 10) / 100).toFixed(2);

    // Formata no padrão brasileiro
    const formatted = new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(Number(numericValue));

    return formatted;
}
