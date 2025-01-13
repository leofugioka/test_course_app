import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomeRoute from "./HomeRoute";
import { createServer } from "../test/server";

createServer([
  {
    path: "/api/repositories",
    res: (req) => {
      const language = req.url.searchParams.get("q").split("language:")[1];
      console.log(language, "new");
      return {
        items: [
          {
            id: 1,
            full_name: `${language}_one`,
          },
          {
            id: 2,
            full_name: `${language}_two`,
          },
        ],
      };
    },
  },
]);

test("renders two links for each language", async () => {
  render(
    <MemoryRouter>
      <HomeRoute />
    </MemoryRouter>
  );

  const languages = ["javascript", "typescript", "rust", "java", "python", "go"];

  for (let language of languages) {
    const links = await screen.findAllByRole("link", { name: new RegExp(`${language}_`) });

    // Assert each table has two links
    expect(links).toHaveLength(2);

    // Different ways to assert each link:
    expect(links[0]).toHaveTextContent(`${language}_one`);
    expect(links[1]).toHaveTextContent(`${language}_two`);
    expect(links[0]).toHaveAttribute("href", `/repositories/${language}_one`);
    expect(links[1]).toHaveAttribute("href", `/repositories/${language}_two`);
  }
});

const pause = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 100);
  });
