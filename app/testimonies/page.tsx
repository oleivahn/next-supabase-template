"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const Testimonies = () => {
  const [taskTest, setTaskTest] = useState("");
  const testTasks = useQuery(api.testTaskTable.get);
  const createTestTask = useMutation(api.testTaskTable.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskTest.trim()) return;

    try {
      await createTestTask({ taskTest });
      console.log("📗 [ Data Created ]:", taskTest);
      setTaskTest("");
    } catch (error) {
      console.log("📕 [ Error ]:", error);
    }
  };

  return (
    <div className="container flex min-h-[80vh] flex-col items-center justify-center">
      {/* - Form Section */}
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col gap-4"
      >
        <input
          type="text"
          name="taskTest"
          value={taskTest}
          onChange={(e) => setTaskTest(e.target.value)}
          placeholder="Enter task test value..."
          className="rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800"
        />
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Test Database
        </button>
      </form>

      {/* - Data Display Section */}
      {testTasks && testTasks.length > 0 && (
        <div className="mt-8 w-full max-w-md">
          <p className="mb-4 text-xl font-semibold">Test Task Table Data:</p>
          <div className="space-y-2">
            {testTasks.map(({ _id, taskTest }) => (
              <div
                key={_id}
                className="rounded-md border border-gray-200 px-4 py-2 dark:border-gray-700"
              >
                {taskTest}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonies;
