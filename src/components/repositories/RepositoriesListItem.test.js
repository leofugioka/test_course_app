import { findByRole, render, screen } from "@testing-library/react";
import RepositoriesListItem from "./RepositoriesListItem";
import { MemoryRouter } from "react-router";

function renderComponent() {
  const repository = {
    full_name: "facebook/react",
    language: "JavaScript",
    description: "A js library",
    owner: { login: "facebook" },
    name: "react",
    html_url: "https://github.com/facebook/react",
  };
  render(
    <MemoryRouter>
      <RepositoriesListItem repository={repository} />
    </MemoryRouter>
  );

  return { repository };
}

test("component shows a link to the repository' github page", async () => {
  const { repository } = renderComponent();

  await screen.findByRole("img", { name: /javascript/i });

  const link = screen.getByRole("link", { name: /github repository/i });

  expect(link).toHaveAttribute("href", repository.html_url);
});

test("shows a fileicon with the appropriate icon", async () => {
  renderComponent();

  const icon = await screen.findByRole("img", { name: /javascript/i });

  expect(icon).toHaveClass("js-icon");
});

test("shows a link to the code editor page", async () => {
  const { repository } = renderComponent();

  await screen.findByRole("img", { name: /javascript/i });

  const link = await screen.findByRole("link", { name: new RegExp(repository.owner.login) });

  console.log(link);

  expect(link).toHaveAttribute("href", `/repositories/${repository.full_name}`);
});

// when dealing with "act" problems, it's a sign that a fetch is happening
// fetch is async, and RTL already uses it behind the scenes in some matchers, like: findBy and findAllBy
// so, the first solution to "act" problem is to use the aforementioned matchers instead of the get or query counterparts

// another solution is to mock the part of the component that we don't want to handle, if we don't want to handle
// due to the matter of time or resources, e.g.:

// jest.mock("../tree/FileIcon", () => {
//   return () => {
//     return "File Icon Component";
//   };
// });
