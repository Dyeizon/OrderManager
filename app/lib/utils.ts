export const statusToText = (status: number) => {
    switch (status) {
        case 1:
            return "A pagar"
        case 2:
            return "Pago"
        case 3:
            return "Em produção"
        case 4:
            return "Pronto"
        case 5:
            return "Fechado"
        default: 
            return "-"

    }
  }