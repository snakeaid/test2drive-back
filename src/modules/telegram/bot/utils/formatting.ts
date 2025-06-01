export const bold = (text: string) => {
  return `<b>${text}</b>`;
};

export const italic = (text: string) => {
  return `<i>${text}</i>`;
};

export const link = (url: string, text: string) => {
  return `<a href="${url}">${text}</a>`;
};
