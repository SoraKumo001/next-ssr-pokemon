# next-ssr-pokemon

Sample of [next-ssr](https://www.npmjs.com/package/next-ssr)

- repository  
  https://github.com/SoraKumo001/next-ssr-pokemon

- URLs running on Vercel  
  https://next-ssr-pokemon.vercel.app/1

# Example

- src/layout/Layout.tsx

```tsx
import { SSRHeadRoot, SSRProvider } from "next-ssr";
import { headers } from "next/headers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  headers();
  return (
    <html lang="en">
      <SSRProvider>
        <head>
          <SSRHeadRoot />
        </head>
        <body>{children}</body>
      </SSRProvider>
    </html>
  );
}
```

- src/app/[page]/page.tsx

```tsx
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
```

- src/app/pokemon/[name]/page.tsx

```tsx
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
```
