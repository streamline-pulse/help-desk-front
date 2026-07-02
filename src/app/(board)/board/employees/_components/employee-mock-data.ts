export type Department =
  | "Finance"
  | "HR"
  | "Marketing"
  | "Sales"
  | "Engineering"

export type EmploymentStatus = "Active" | "Inactive"

export type Employee = {
  id: string
  department: Department
  email: string
  employment: EmploymentStatus
  years: number
  firstName: string
  lastName: string
  startDate: string
  education: string
}

export const employees: Employee[] = [
  {
    id: "EMP001",
    department: "Finance",
    email: "alfredwhite@zipper.com",
    employment: "Active",
    years: 3,
    firstName: "Alfred",
    lastName: "White",
    startDate: "2018-10-24",
    education: "BCom.",
  },
  {
    id: "EMP002",
    department: "HR",
    email: "alexreed@zipper.com",
    employment: "Active",
    years: 7,
    firstName: "Alex",
    lastName: "Reed",
    startDate: "2017-03-15",
    education: "BSc.",
  },
  {
    id: "EMP003",
    department: "Marketing",
    email: "blakecole@zipper.com",
    employment: "Inactive",
    years: 2,
    firstName: "Blake",
    lastName: "Cole",
    startDate: "2022-06-01",
    education: "BA",
  },
  {
    id: "EMP004",
    department: "Sales",
    email: "carlyjones@zipper.com",
    employment: "Active",
    years: 12,
    firstName: "Carly",
    lastName: "Jones",
    startDate: "2012-01-10",
    education: "BCom.",
  },
  {
    id: "EMP005",
    department: "Engineering",
    email: "danielkim@zipper.com",
    employment: "Active",
    years: 5,
    firstName: "Daniel",
    lastName: "Kim",
    startDate: "2019-08-20",
    education: "BEng.",
  },
  {
    id: "EMP006",
    department: "Finance",
    email: "emilynguyen@zipper.com",
    employment: "Inactive",
    years: 4,
    firstName: "Emily",
    lastName: "Nguyen",
    startDate: "2020-11-05",
    education: "BCom.",
  },
  {
    id: "EMP007",
    department: "HR",
    email: "frankmiller@zipper.com",
    employment: "Active",
    years: 9,
    firstName: "Frank",
    lastName: "Miller",
    startDate: "2015-04-18",
    education: "BSc.",
  },
  {
    id: "EMP008",
    department: "Marketing",
    email: "gracepark@zipper.com",
    employment: "Active",
    years: 1,
    firstName: "Grace",
    lastName: "Park",
    startDate: "2023-02-28",
    education: "BA",
  },
  {
    id: "EMP009",
    department: "Sales",
    email: "henryclark@zipper.com",
    employment: "Inactive",
    years: 6,
    firstName: "Henry",
    lastName: "Clark",
    startDate: "2018-07-12",
    education: "BCom.",
  },
  {
    id: "EMP010",
    department: "Engineering",
    email: "isabellawright@zipper.com",
    employment: "Active",
    years: 8,
    firstName: "Isabella",
    lastName: "Wright",
    startDate: "2016-09-30",
    education: "BEng.",
  },
]

export const departmentColors: Record<Department, string> = {
  Finance: "bg-emerald-500",
  HR: "bg-orange-400",
  Marketing: "bg-violet-500",
  Sales: "bg-blue-500",
  Engineering: "bg-neutral-400",
}
