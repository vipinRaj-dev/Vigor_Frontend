"use client";

import axiosInstance from "@/axios/creatingInstance";
import { use, useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { Badge } from "../ui/badge";

import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { late, string } from "zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { Clock, Clock10Icon } from "lucide-react";

type User = {
  admissionNumber: number;
  email: string;
  healthIssues: {
    BloodPressure: number;
    Diabetes: number;
    HeartDisease: boolean;
    KidneyDisease: boolean;
    LiverDisease: boolean;
    Others: boolean;
    Thyroid: boolean;
    cholesterol: number;
    _id: string;
  };
  height: number;
  mobileNumber: number;
  name: string;
  profileImage: string;
  trainerPaymentDetails: string[];
  trainerPaymentDueDate: string;
  userBlocked: boolean;
  weight: number;
  _id: string;
};

type Nutrition = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type FoodId = {
  foodname: string;
  foodtype: string;
  nutrition: Nutrition;
  photoUrl: string;
};

type FoodLog = {
  foodId: FoodId;
  quantity: string;
  status: boolean;
  time: string;
  timePeriod: string;
  updatedAt: string;
  userId: string;
};

type AttendanceData = {
  foodLogs: FoodLog[];
  isPresent: boolean;
  userId: string;
};

type ResponseType = {
  attandanceData: AttendanceData;
};

const ClientDetailsFromTrainer = ({ client_Id }: { client_Id: string }) => {
  const router = useRouter();

  const timePeriods = ["morning", "afternoon", "evening"];

  const [clientDetails, setClientDetails] = useState<User | null>(null);
  const [latestDiet, setLatestDiet] = useState<any[]>([]);
  const [done, setDone] = useState(false);

  const [attendanceData, setAttendanceData] =
    useState<ResponseType["attandanceData"]>();

  const [userCreatedDate, setUserCreatedDate] = useState<Date>();
  const [date, setDate] = useState<Date>(
    new Date(new Date().setHours(0, 0, 0, 0))
  );

  const [schedule, setSchedule] = useState({
    timePeriod: "morning",
    quantity: 0,
    time: "10:00",
  });

  useEffect(() => {
    // console.log(client_Id);

    axiosInstance
      .get(`/food/client/${client_Id}`)
      .then((res) => {
        console.log(res.data);
        setClientDetails(res.data);
        setLatestDiet(res.data.latestDiet);
        console.log("res.data.createdAt", res.data.createdAt);
        let userCreated = new Date(res.data.createdAt);
        userCreated.setHours(0, 0, 0, 0);
        setUserCreatedDate(userCreated);
      })
      .catch((err: Error | any) => {
        console.log(err.response.data);
        if (err.response.status === 404) {
          Cookies.remove("jwttoken");
          router.replace("/sign-in");
        }
      });
  }, [client_Id, done]);
  // console.log(clientDetails);
  // console.log(latestDiet);

  useEffect(() => {
    if (date) {
      console.log("date", date);

      axiosInstance
        .get(`trainer/getFood/${client_Id}/${date}`)
        .then((res) => {
          console.log(res.data);
          setAttendanceData(res.data.attandanceData);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [date]);

  const handleChange = (name: string, value: string | null) => {
    setSchedule((prevSchedule) => ({
      ...prevSchedule,
      [name]: value,
    }));
  };

  const handleSubmit = async (foodId: string) => {
    console.log(foodId, client_Id);
    try {
      axiosInstance
        .put(`/food/addTimeDetails/${client_Id}/${foodId}`, schedule)
        .then((res) => {
          if (res.status === 200) {
            console.log(res.data);
            setDone(!done);
          }
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = (foodId: string) => {
    console.log(foodId, client_Id);
    try {
      axiosInstance
        .delete(`/food/deletePerFood/${client_Id}/${foodId}`)
        .then((res) => {
          if (res.status === 200) {
            console.log(res.data);
            setDone(!done);
            // setLatestDiet(latestDiet.filter(food => food._id !== foodId));
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const setDateToStart = (date: Date | number) => {
    let newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  return (
    <div>
      {/* ClientDetailsFromTrainer {client_Id} */}
      <div className=" h-screen md:flex w-full ">
        <div className=" md:w-1/2 flex md:flex md:flex-col w-full h-1/2 md:h-full">
          <div className=" md:h-1/2 w-1/2 md:w-full  ">
            {clientDetails && (
              <div className="p-3  bg-slate-600 m-2 mt-12 text-white rounded-3xl text-xs md:text-lg md:font-medium leading-relaxed md:leading-loose flex gap-10">
                <div className="mb-2">
                  <img
                    className=" object-cover w-96 h-96 rounded-xl"
                    src={clientDetails.profileImage}
                    alt=""
                  />
                </div>

                <div className="p-5">
                  <div className="flex text-xl font-semibold tracking-wide">
                    <p>Name : </p>
                    <p>{clientDetails.name}</p>
                  </div>
                  <div className="flex">
                    <p>Adm.No : </p>
                    <p>{clientDetails.admissionNumber}</p>
                  </div>

                  <div className="flex">
                    <p>Weight : </p>
                    {clientDetails.weight}
                  </div>
                  <div className="flex">
                    <p>Height : </p>
                    {clientDetails.height}
                  </div>
                  <div className="flex">
                    <p>Mob.No : </p>
                    {clientDetails.mobileNumber}
                  </div>

                  <div className="flex">
                    <p>Email: </p>
                    {clientDetails.email}
                  </div>

                  <div className="flex">
                    <p className="text-sm md:text-xl underline p-2">
                      Health Issues
                    </p>
                  </div>
                  <div className="ml-10">
                    {Object.entries(clientDetails.healthIssues).map(
                      ([key, value]) => {
                        if (key !== "_id" && value && value !== 0) {
                          return (
                            <div key={key}>
                              {key}: {value === true ? "Yes" : value.toString()}
                            </div>
                          );
                        }
                        return null;
                      }
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className=" md:h-1/2 w-1/2 md:w-full flex justify-center items-center">
            <Calendar
              mode="single"
              showOutsideDays={false}
              onDayClick={(day) => setDate(setDateToStart(day))}
              selected={date}
              disabled={(date) =>
                date < (userCreatedDate ?? new Date()) || date > new Date()
              }
              initialFocus
              className="bg-slate-800 p-10 rounded-xl"
            />
          </div>
        </div>

        <div className=" md:w-1/2 h-1/2 md:h-full w-full">
          <div className=" h-screen md:w-full  p-5">
            <div className="m-5">
              <div className="flex justify-center pb-3">
                {attendanceData && attendanceData.isPresent ? (
                  <Badge variant={"outline"} className="bg-green-500 p-2">
                    Present : {date && date.toDateString()}
                  </Badge>
                ) : (
                  <Badge className="bg-red-500 p-2">
                    Absent : {date && date.toDateString()}
                  </Badge>
                )}
              </div>

              <div className="w-full h-36  flex justify-evenly">
                {timePeriods.map((period) => {
                  const filteredLogs =
                    attendanceData &&
                    attendanceData.foodLogs.filter(
                      (log) => log.timePeriod === period && log.status === true
                    );
                  const totalNutrition =
                    filteredLogs &&
                    filteredLogs.reduce(
                      (total, log) => {
                        return {
                          calories:
                            total.calories + log.foodId.nutrition.calories,
                          protein: total.protein + log.foodId.nutrition.protein,
                          carbs: total.carbs + log.foodId.nutrition.carbs,
                          fat: total.fat + log.foodId.nutrition.fat,
                        };
                      },
                      { calories: 0, protein: 0, carbs: 0, fat: 0 }
                    );

                  return (
                    <div
                      key={period}
                      className="w-1/4 bg-slate-600 rounded-lg p-3"
                    >
                      <h1 className="text-xl font-semibold mb-1">{`${
                        period.charAt(0).toUpperCase() + period.slice(1)
                      } Meal`}</h1>
                      <h1>
                        Calories : {totalNutrition && totalNutrition.calories}
                      </h1>
                      <h1>
                        Protein : {totalNutrition && totalNutrition.protein}
                      </h1>
                      <h1>Carb : {totalNutrition && totalNutrition.carbs}</h1>
                      <h1>Fat : {totalNutrition && totalNutrition.fat}</h1>
                    </div>
                  );
                })}

                {/* <div className="w-1/4 bg-slate-600 rounded-lg p-5">box</div>
              <div className="w-1/4 bg-slate-600 rounded-lg p-5">box</div> */}
              </div>
            </div>

            <div className=" rounded-lg h-3/6 overflow-y-scroll  scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-950">
              <Table>
                <TableCaption className="p-5">Date wise Result</TableCaption>
                <TableHeader className="">
                  <TableRow>
                    <TableHead className="w-[100px]">Image</TableHead>
                    <TableHead>Food Name</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                {attendanceData &&
                  attendanceData.foodLogs.map((data, index) => {
                    return (
                      <TableBody className="bg-slate-800 ">
                        <TableRow>
                          <TableCell className="font-medium">
                            {/* <img src={data.foodId.photoUrl} alt="food image" /> */}
                            <Image
                              className="rounded-xl"
                              src={data.foodId.photoUrl}
                              width={60}
                              height={60}
                              alt="food image"
                            />
                          </TableCell>
                          <TableCell>{data.foodId.foodname}</TableCell>
                          <TableCell>
                            <h1> {data.time}</h1>
                            <h1> {data.timePeriod}</h1>
                          </TableCell>
                          <TableCell className="text-right">
                            <p>{data.status ? "Taken" : "Not Taken"}</p>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    );
                  })}
              </Table>
            </div>
          </div>
        </div>
      </div>

      <div className="h-screen p-10">
        <div className="flex justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-wide">
              Schedule Diet
            </h1>
          </div>
          <div>
            <Link href={`/trainer/addDiet/${client_Id}`}>
              <Button>Add Food</Button>
            </Link>
          </div>
        </div>
        <div className="mt-5 mb-20 relative">
          <div className="absolute w-full h-1 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
        </div>
        <div className=" p-5 h-5/6 overflow-y-scroll  scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-950">
          {latestDiet.map((food: any, index) => {
            return (
              <div
                className="flex gap-2 mb-4 h-36 p-3 bg-[#2C2C2E] rounded-lg justify-between items-center"
                key={food._id}
              >
                <div className="flex items-center gap-3 h-full w-80">
                  <div className="rounded-3xl w-32  overflow-hidden">
                    <img
                      className="w-full h-full object-contain "
                      src={food.foodId.photoUrl}
                      alt={food.foodId.name}
                    />
                  </div>
                  <div className="flex items-center">
                    <h1>{food.foodId.foodname}</h1>
                  </div>
                </div>

                <div>
                  {food && food.foodId.nutrition ? (
                    Object.entries(food.foodId.nutrition).map(
                      ([key, value]) => {
                        if (typeof value === "number" && value !== 0) {
                          return (
                            <div key={key}>
                              <h1>
                                {key} : {value}
                              </h1>
                            </div>
                          );
                        } else {
                          return null;
                        }
                      }
                    )
                  ) : (
                    <p>No nutrition information available.</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <div>
                    {
                      <div>
                        <div className="flex">
                          <p>Quantity : </p>
                          <p>{food.quantity}</p>
                        </div>
                        <div className="flex">
                          <p>Time : </p>
                          <p>{food.time}</p>
                        </div>
                        <div className="flex">
                          <p>Time Period : </p>
                          <p>{food.timePeriod}</p>
                        </div>
                      </div>
                    }
                  </div>
                  <div className="flex items-center px-5">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className=" bg-black" variant="outline">
                          Edit Profile
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] bg-black">
                        <DialogHeader>
                          <DialogTitle>Edit</DialogTitle>
                          <DialogDescription>
                            Add Time details
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="time" className="text-right">
                              Name
                            </Label>
                            <select
                              className="text-black p-1 w-32 rounded-md"
                              name="timePeriod"
                              value={schedule.timePeriod}
                              onChange={(event) =>
                                handleChange("timePeriod", event.target.value)
                              }
                            >
                              <option value="morning">morning</option>
                              <option value="afternoon">afternoon</option>
                              <option value="evening">evening</option>
                            </select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                              Quantity
                            </Label>
                            <Input
                              className="text-white p-2 w-32 "
                              type="number"
                              name="quantity"
                              value={schedule.quantity}
                              onChange={(event) =>
                                handleChange("quantity", event.target.value)
                              }
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                              Time
                            </Label>
                            {/* <input
                              type="time"
                              name="time"
                              onChange={handleChange}
                              value={schedule.time}
                              className="w-full placeholder-gray-500 p-1 text-gray-900 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
                            /> */}
                            <TimePicker
                              className={
                                "text-gray-600 p-2 w-44 rounded-md bg-white"
                              }
                              onChange={(value) => handleChange("time", value)}
                              value={schedule.time}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button onClick={() => handleSubmit(food._id)}>
                              Save changes
                            </Button>
                          </DialogClose>
                          <Button onClick={() => handleRemove(food._id)}>
                            Remove
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gray-500 h-screen">
        Workout Schedule
        
      </div>
    </div>
  );
};

export default ClientDetailsFromTrainer;
