/** @format */

import ResponseDetail from "./ResponseDetail";
import ResponseTimeline from "./ResponseTimeline";

function ResponseWorkspace({
  responses,
  fields,
  page,
  pageSize,
  totalPages,
  filteredCount,
  selectedResponse,
  onSelectResponse,
  onPageChange,
}) {
  return (
    <div className="grid min-h-[560px] overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm lg:grid-cols-[minmax(270px,0.78fr)_minmax(0,1.7fr)]">
      <ResponseTimeline
        responses={responses}
        fields={fields}
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        filteredCount={filteredCount}
        selectedResponse={selectedResponse}
        onSelectResponse={onSelectResponse}
        onPageChange={onPageChange}
      />
      <ResponseDetail
        selectedResponse={selectedResponse}
        responses={responses}
        page={page}
        pageSize={pageSize}
        fields={fields}
      />
    </div>
  );
}

export default ResponseWorkspace;
