"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

// - UI Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Testimonies = () => {
  const [taskTest, setTaskTest] = useState("");
  const [pending, setPending] = useState(false);
  const [editingId, setEditingId] = useState<Id<"testTasks"> | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const testTasks = useQuery(api.testTasks.get);
  const createTestTask = useMutation(api.testTasks.create);
  const updateTestTask = useMutation(api.testTasks.update);
  const deleteTestTask = useMutation(api.testTasks.remove);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskTest.trim()) return;

    setPending(true);
    try {
      await createTestTask({ taskTest });
      console.log("📗 [ Data Created ]:", taskTest);
      setTaskTest("");
    } catch (error) {
      console.log("📕 [ Error ]:", error);
    } finally {
      setPending(false);
    }
  };

  const handleDelete = async (id: Id<"testTasks">) => {
    try {
      await deleteTestTask({ id });
      console.log("📗 [ Data Deleted ]:", id);
    } catch (error) {
      console.log("📕 [ Error ]:", error);
    }
  };

  const handleEdit = (id: Id<"testTasks">, currentValue: string) => {
    setEditingId(id);
    setEditingValue(currentValue);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue("");
  };

  const handleUpdate = async () => {
    if (!editingId || !editingValue.trim()) return;

    try {
      await updateTestTask({ id: editingId, taskTest: editingValue });
      console.log("📗 [ Data Updated ]:", editingValue);
      setEditingId(null);
      setEditingValue("");
    } catch (error) {
      console.log("📕 [ Error ]:", error);
    }
  };

  return (
    <div className="container flex min-h-[80vh] flex-col items-center justify-center">
      {/* - Form Section */}
      <Card className="w-full max-w-md px-6 py-8 shadow-lg dark:bg-darker">
        <CardHeader className="mb-4">
          <CardTitle className="mb-2 text-2xl font-bold text-primary">
            Test Database
          </CardTitle>
          <CardDescription>
            Enter a value to test the Convex database connection.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="text"
              name="taskTest"
              value={taskTest}
              onChange={(e) => setTaskTest(e.target.value)}
              placeholder="Enter task test value..."
            />
            <Button type="submit" disabled={pending}>
              {pending ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* - Data Display Section */}
      {testTasks && testTasks.length > 0 && (
        <div className="mt-8 w-full max-w-md">
          <p className="mb-4 text-xl font-semibold">Test Table Data:</p>
          <div className="space-y-2">
            {testTasks.map(({ _id, taskTest }) => (
              <Card key={_id}>
                <CardContent className="flex items-center justify-between gap-2 px-4 py-2">
                  {editingId === _id ? (
                    // - Edit Mode
                    <div className="flex w-full items-center gap-2">
                      <Input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="flex-1"
                      />
                      <Button size="sm" onClick={handleUpdate}>
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    // - Display Mode
                    <>
                      <span className="flex-1">{taskTest}</span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(_id, taskTest)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(_id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonies;
