import Link from "next/link";
import { PER_PAGE } from "@/config/index";
export default function Pagination({ page, total }) {
  const lastPage = Math.ceil(total / PER_PAGE);
  return (
    <div className="links" style={{ display: "flex" }}>
      {page > 1 && (
        <Link href={`/events?page=${page - 1}`}>
          <div className="btn-secondary">Prev</div>
        </Link>
      )}
      {page < lastPage && (
        <Link href={`/events?page=${page + 1}`}>
          <div className="btn-secondary">Next</div>
        </Link>
      )}
    </div>
  );
}
