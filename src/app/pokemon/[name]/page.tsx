"use client";
import { SSRHead, useSSR } from "next-ssr";
import Link from "next/link";
import { useParams } from "next/navigation";

type Pokemon = {
  abilities: { ability: { name: string; url: string } }[];
  base_experience: number;
  height: number;
  id: number;
  name: string;
  order: number;
  species: { name: string; url: string };
  sprites: {
    back_default: string;
    back_female: string;
    back_shiny: string;
    back_shiny_female: string;
    front_default: string;
    front_female: string;
    front_shiny: string;
    front_shiny_female: string;
  };
  weight: number;
};

const pokemon = (name: string): Promise<Pokemon> =>
  fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then((r) => r.json());

const Page = () => {
  const params = useParams();
  const name = String(params["name"]);
  const { data } = useSSR(() => pokemon(name), {
    key: `pokemon-${name}`,
  });
  if (!data) return <div>loading</div>;
  return (
    <>
      <SSRHead>
        <title>{name}</title>
      </SSRHead>
      <div style={{ padding: "8px" }}>
        <Link
          href="/1"
          style={{
            textDecoration: "none",
            padding: "8px 32px",
            boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
          }}
        >
          ⏪️List
        </Link>
      </div>
      <hr style={{ margin: "24px 0" }} />
      <div
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "8px",
        }}
      >
        <img
          style={{ boxShadow: "0 0 8px rgba(0, 0, 0, 0.5)" }}
          src={data.sprites.front_default}
        />
        <div>{name}</div>
      </div>
    </>
  );
};
export default Page;
