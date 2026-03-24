import { useParams, useNavigate, Link } from "react-router";
import { useRecipeStore } from "../store/useRecipeStore";
import FloatingActionButton from "../parts/FloatingActionButton";

export default function ListView() {
    const { query } = useParams();
    const { recipes } = useRecipeStore();
    const navigate = useNavigate();
    const compQuery = query?.toLowerCase().trim();

    const highlightMatches = (raw) => {
        if (!compQuery) {
            return raw;
        }

        var pos = raw.toLowerCase().indexOf(compQuery);
        if (pos >= 0) {
            var res = (
                <>
                    {raw.substring(0, pos)}<span className="font-bold text-yellow-600">{raw.substring(pos, pos + compQuery.length)}</span>{raw.substring(pos + compQuery.length)}
                </>
            )
            return res;
        }

        return raw;
    }

    let results;

    if (compQuery) {
        results = recipes.filter((r) => {
            return (
                r.name.toLowerCase().indexOf(compQuery) >= 0 ||
                (r.ingredients && (r.ingredients?.toLowerCase().indexOf(compQuery) >= 0))
            )
        })
    } else {
        results = recipes;
    }

    return (
        <div className="mt-3">
            {compQuery &&
                <>
                    <div className="mb-4">
                        Results for "<span className="font-bold text-yellow-600">{compQuery}</span>"
                    </div>
                </>
            }

            {results.map((r) => {
                return (
                    <Link key={r._id} className="" to={`/rec/${r._id}`}>
                        <div className="text-sky-600 text-xl leading-8">{highlightMatches(r.name)}</div>
                    </Link>
                );
            })
            }

            <FloatingActionButton onClick={() => { navigate("/edit") }} />
        </div>
    );
}
