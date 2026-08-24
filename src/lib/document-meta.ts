type DocumentMeta = {
  title: string;
  description: string;
};

export function setDocumentMeta({ title, description }: DocumentMeta) {
  document.title = title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", description);
}
