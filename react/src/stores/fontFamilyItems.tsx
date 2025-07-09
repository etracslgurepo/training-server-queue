export type FontFamily = { id: string; family: string };

export const fontitem: FontFamily[] = [
  // Serif Fonts
  {
    id: "Arial",
    family: "Arial, Helvetica, sans-serif",
  },
  { id: "Georgia", family: "Georgia, serif" },
  {
    id: "Palatino Linotype",
    family: "Palatino Linotype, Book Antiqua, Palatino, serif",
  },
  { id: "Bookman Old Style", family: "Bookman Old Style, serif" },
  { id: "New Century Schoolbook", family: "New Century Schoolbook, serif" },
  { id: "Cambria", family: "Cambria, serif" },

  // Sans-serif Fonts
  { id: "Times New Roman", family: "Times New Roman, Times, serif" },
  { id: "Verdana", family: "Verdana, Geneva, sans-serif" },
  { id: "Tahoma", family: "Tahoma, Geneva, sans-serif" },
  { id: "Calibri", family: "Calibri, sans-serif" },
  { id: "Helvetica", family: "Helvetica, sans-serif" },
  { id: "Trebuchet MS", family: "Trebuchet MS, sans-serif" },
  { id: "Lato", family: "Lato, sans-serif" },
  { id: "Open Sans", family: "Open Sans, sans-serif" },
  { id: "Roboto", family: "Roboto, sans-serif" },
  { id: "Noto Sans", family: "Noto Sans, sans-serif" },
  { id: "Source Sans Pro", family: "Source Sans Pro, sans-serif" },
  { id: "Montserrat", family: "Montserrat, sans-serif" },

  // Monospace Fonts
  { id: "Courier New", family: "Courier New, Courier, monospace" },
  { id: "Lucida Console", family: "Lucida Console, Monaco, monospace" },
  { id: "Consolas", family: "Consolas, monospace" },
  { id: "Liberation Mono", family: "Liberation Mono, monospace" },
  { id: "Menlo", family: "Menlo, monospace" },

  // Fantasy Fonts
  { id: "Comic Sans MS", family: "Comic Sans MS, cursive" },
  { id: "Impact", family: "Impact, Charcoal, sans-serif" },
  { id: "Copperplate", family: "Copperplate, Papyrus, fantasy" },

  // Cursive Fonts
  { id: "Brush Script MT", family: "Brush Script MT, cursive" },
  { id: "Lucida Handwriting", family: "Lucida Handwriting, cursive" },
  { id: "Segoe Script", family: "Segoe Script, cursive" },
];

export function getFontFamily() {
  return fontitem;
}

export function getFontFamilyId(id: string | undefined) {
  return fontitem.find((fontitem) => fontitem.id === id);
}
