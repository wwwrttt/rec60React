import { useParams, Link } from "react-router";

export default function ListView({ recipes }) {
    const { query } = useParams(),
        compQuery = query?.toLowerCase().trim();

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
        results = recipes.filter((r) => { return r.name.toLowerCase().indexOf(compQuery) >= 0 })
    } else {
        results = recipes;
    }

    return (
        <div className="m-3">

            {compQuery &&
                <>
                    <div className="mb-4">
                        Results for "<span className="font-bold text-yellow-600">{compQuery}</span>"
                    </div>
                </>
            }

            {
                results.map((r) => {
                    return (
                        <Link key={r._id} className="" to={`/rec/${r._id}`}>
                            <div className="text-sky-600 text-xl leading-8 ml-5">{highlightMatches(r.name)}</div>
                        </Link>
                    );
                })
            }
        </div >
    );
}
