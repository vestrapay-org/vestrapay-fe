function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function maskAccountNumber(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 4) return "•••• •••• ••••";
  return `•••• •••• ${digits.slice(-4)}`;
}

function maskIdNumber(value: string): string {
  const v = value.trim();
  if (v.length < 4) return "••••-••••-••••";
  return `••••-••••-${v.slice(-4)}`;
}

export { formatFileSize, maskAccountNumber, maskIdNumber };
