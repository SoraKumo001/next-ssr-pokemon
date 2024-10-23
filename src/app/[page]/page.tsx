"use client";
import { SSRHead, useSSR } from "next-ssr";
import Link from "next/link";
import { useParams } from "next/navigation";

type PokemonList = {
  count: number;
  next: string;
  previous: string | null;
  results: { name: string; url: string }[];
};

const pokemonList = (page: number): Promise<PokemonList> =>
  fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${(page - 1) * 20}`).then(
    (r) => r.json()
  );

const Page = () => {
  const params = useParams();
  const page = Number(params["page"] ?? 1);
  const { data } = useSSR(() => pokemonList(page), {
    key: `pokemon-list-${page}`,
  });
  if (!data) return <div>loading</div>;
  return (
    <>
      <SSRHead>
        <title>Pokemon List</title>
      </SSRHead>
      <div style={{ display: "flex", gap: "8px", padding: "8px" }}>
        <Link
          href={page > 1 ? `/${page - 1}` : ""}
          style={{
            textDecoration: "none",
            padding: "8px",
            boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          ⏪️
        </Link>
        <Link
          href={page < Math.ceil(data.count / 20) ? `/${page + 1}` : ""}
          style={{
            textDecoration: "none",
            padding: "8px",
            boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          ⏩️
        </Link>
      </div>
      <hr style={{ margin: "24px 0" }} />
      <div>
        {data.results.map(({ name }) => (
          <div key={name}>
            <Link href={`/pokemon/${name}`}>{name}</Link>
          </div>
        ))}
      </div>
    </>
  );
};
export default Page;
