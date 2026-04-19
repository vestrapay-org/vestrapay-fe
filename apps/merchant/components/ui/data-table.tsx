import React from "react";

type DataTableProps = {
  headers: string[];
  minWidthClassName: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function DataTable({ headers, minWidthClassName, children, footer }: DataTableProps) {
  return (
    <div className="min-w-0 max-w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] touch-pan-x">
        <table className={`w-full border-collapse ${minWidthClassName}`}>
          <thead>
            <tr className="border-b border-gray-100 bg-white">
              {headers.map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-[0.65rem] font-bold uppercase tracking-wider text-gray-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
      {footer ? (
        <div className="flex flex-col gap-2 px-4 py-3 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
