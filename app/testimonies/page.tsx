"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const Testimonies = () => {
  const tasks = useQuery(api.tasks.get);

  return (
    <>
      <div className="container mt-6">
        <p className="text-3xl">Testimonies</p>

        <div className="mt-6 space-y-2">
          <p className="text-xl font-semibold">Tasks from Convex:</p>
          {tasks?.map(({ _id, text, isCompleted }) => (
            <div key={_id} className="flex items-center gap-2">
              <span>{isCompleted ? "✅" : "⬜"}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Testimonies;
