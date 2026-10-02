type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  type?: "default" | "success" | "primary";
};

export default function StatCard({
  label,
  value,
  detail,
  type = "default",
}: StatCardProps) {
  return (
    <article className={`stat-card stat-${type}`}>
      <div className="stat-label">{label}</div>

      <div className="stat-value">{value}</div>

      <div className="stat-detail">{detail}</div>
    </article>
  );
}