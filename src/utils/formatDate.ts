import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';

export const getFormattedDate = (value: string): string => {
  const date = format(new Date(value), 'dd MMM yyyy', {
    locale: ptBR,
  });

  return date;
};
