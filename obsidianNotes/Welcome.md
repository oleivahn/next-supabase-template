#### Description

I want to build an fitness application that keeps track of custom built workouts and will later keep overall track of progress per exercise. Also, I want to show a preview of the last exercise the user made the last time. What is the recommended data structure for a database?
I want to use convex because I want to make competitive games within the app later. The user will have the ability to create their own workouts along their custom rest timers. i.e: Workout 1 pushups x 15, give 1 mins to complete rest for 30 secs pullups x 5, give 1 min to complete rest 30 secs so on and so forth. The user will be able to leave a notes for the just-performed exercise too. And at the end, leave a workout rating rating for how they felt afterward.
Everything will run on timers and custom ability to create their own workouts.
I will also be using clerk for auth
I want to understand what's happening. Can you break down the tables and their structures and how they connect to each other. Make a little diagram if possible. We will do the coding part later

---

You'll want at least **4–5 main collections**:

| Collection                             | Purpose                                                                         |
| -------------------------------------- | ------------------------------------------------------------------------------- |
| `users`                                | Auth + profile (usually linked to Clerk)                                        |
| `workouts`                             | Stores user-created workout templates (reusable programs)                       |
| `exercises`                            | Library of all exercises (custom or predefined)                                 |
| `workoutSections` (or `workoutBlocks`) | Stores sequential blocks inside a workout (exercise + rest + timer data)        |
| `workoutLogs`                          | Records of completed sessions used for progress tracking & last-session preview |

1. DATABASE SCHEMAS (copy/paste ready — document DB style)

```
// users
{
  _id: string,         // Clerk user id (primary)
  name: string,
  email: string,
  createdAt: number
}

```

```
// exercises  (optional master list)
{
  _id: string,
  name: string,            // "Pushups"
  category: string|null,   // "chest", "core"
  equipment: string|null,  // "bodyweight", "dumbbell", etc
  createdBy: string|null,  // userId or null for system
  createdAt: number
}

```

```
// workouts   <--- exact original shape + notes + approval fields
{
  _id: string,
  userId: string,              // creator (from Clerk)
  title: string,
  notes: string|null,          // description / tips (you asked for this originally)
  createdAt: number,

  // Publication & moderation (new fields)
  isPublic: boolean,           // visible to all users if true
  status: "private" | "pending" | "approved" | "rejected",
  reviewedBy: string | null,   // admin/moderator id
  reviewedAt: number | null
}

```

```
// workoutBlocks  (template steps / the block system)
{
  _id: string,
  workoutId: string,        // FK -> workouts._id
  order: number,            // 1,2,3...
  exerciseId: string|null,  // optional FK -> exercises._id (or null if free-text)
  exerciseName: string,     // canonical name (useful if exerciseId null)
  expectedReps: number|null,
  expectedDurationSec: number|null,
  expectedRestSec: number|null,
  createdAt: number
}

```

```
// workoutLogs  (the version you liked — blocks inline, session-level notes)
{
  _id: string,
  userId: string,
  workoutId: string,

  startedAt: number,
  endedAt: number,
  totalTimeSec: number|null,

  feelRating: number|null,       // 1-10
  sessionNotes: string|null,     // how they felt / summary

  // Inline blocks (results of that run)
  blocks: [
    {
      blockId: string,           // FK -> workoutBlocks._id
      repsCompleted: number|null,
      durationTakenSec: number|null,
      loadType: "bodyweight" | "dumbbell" | "barbell" | "kettlebell" | "machine" | "band" | "other",
      weightUsed: number|null,   // numeric (0 for BW), can be null
      weightUnit: "lbs" | "kg" | null,
      notes: string|null         // per-exercise note (NEW)
    },
    ...
  ]
}

```

```
// workout_submissions  (optional — track submission history / admin comments)
{
  _id: string,
  workoutId: string,         // the workout being submitted
  submittedBy: string,       // userId who submitted
  submittedAt: number,
  status: "pending" | "approved" | "rejected" | "needs_changes",
  reviewerId: string|null,
  reviewedAt: number|null,
  reviewNotes: string|null
}

```
