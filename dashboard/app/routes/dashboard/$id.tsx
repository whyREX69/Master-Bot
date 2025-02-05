import { redirect, type LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import Logo from "~/components/Logo";
import type { DiscordProfile } from "~/lib/discord-api-fetcher";
import { authenticator } from "~/server/auth.server";
import { Menu } from "@reach/menu-button";
import React from "react";
import type { Guild } from "~/api-types";

type LoaderData = {
  guild: Guild;
  user: DiscordProfile;
};

export let loader: LoaderFunction = async ({ request, params }) => {
  const user = (await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })) as DiscordProfile;
  const response = await fetch(`http://localhost:1212/guild?id=${params.id}`);

  const guild: Guild | null = await response.json();
  if (!guild) redirect("/dashboard");
  return json({ guild, user });
};

export default function DashboardScreenIndex() {
  const { guild, user } = useLoaderData<LoaderData>();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <main className="flex text-gray-400 w-full h-screen relative">
      <div className="absolute top-3 right-3 h-10 w-10 hover:cursor-pointer">
        <img
          className="rounded-full"
          src={`https://cdn.discordapp.com/avatars/${user.id}/${user.__json.avatar}.png`}
          alt="user avatar"
          onClick={() => setMenuOpen(!menuOpen)}
        />
        {menuOpen && (
          <div className="bg-gray-800 p-2 w-fit absolute top-14 right-1">
            <Menu>
              <Form action="/logout" method="post">
                <button type="submit" className="text-red-500">
                  Logout
                </button>
              </Form>
            </Menu>
          </div>
        )}
      </div>
      <div className="min-w-[350px]">
        <div className="p-8 fixed border-r-2 border-gray-500 h-full">
          <div className="mb-8">
            <Logo />
          </div>
          <div className="bg-black text-center text-white font-semibold py-2 mb-12 rounded-xl">
            <p>{guild.name}</p>
          </div>
          <div className="flex flex-col gap-8">
            <div className="hover:text-slate-300">
              <Link to="welcome">
                <p>Welcome Message</p>
              </Link>
            </div>
            <div className="hover:text-slate-300">
              <Link to="commands">
                <p>Commands</p>
              </Link>
            </div>
            <div className="hover:text-slate-300">
              <Link to="temporary-channels">
                <p>Temporary Channels</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="grow">
        <Outlet />
      </div>
    </main>
  );
}
