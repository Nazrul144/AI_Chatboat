import { Suspense } from "react";
import QueuePage from "@/modules/Authentication/QueuePage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <QueuePage />
    </Suspense>
  );
}
