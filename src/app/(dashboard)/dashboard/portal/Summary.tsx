import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { BOOK_SPACE } from "../../../../api/bookingRoutes";
import { handleResponse } from "../../../../api/router";
import { CREATE_TRANSACTION } from "../../../../api/transactionsRoutes";
import { TimesIcon, TrashIcon } from "../../../../assets/icons/index";
import {
  Discount,
  GroupedService,
  GroupedServiceItem,
  OpeningHour,
} from "../../../../global/types";
import {
  calculateTotalPriceAndMinHours,
  compareTimeRangesForSort,
  generateId,
  getAppToken,
} from "../../../../utils";
import { FormatAmount } from "../../../../utils/formatAmount";
import Loading from "../../../loading";
import Receipt from "./Receipt";
import Slots from "./Slots";
import Customer from "./Customer";

function formatTime(time: string) {
  const timeFrom = time.split("-")[0].trim();
  const [hour, period] = timeFrom.replace(/\s/g, " ").split(" ");
  if (period.toLowerCase().trim() === "am") {
    return `${hour.length === 1 ? "0" + hour : hour}:00:00`;
  } else if (period.toLowerCase().trim() === "pm") {
    if (hour === "12") {
      return `12:00:00`;
    }
    return `${parseInt(hour) + 12}:00:00`;
  }
  return `${parseInt(hour) + 12}:00:00`;
}

function combineTimeRanges(str: string) {
  const timeRanges = str.split(", ");

  if (timeRanges.length === 1) {
    return timeRanges[0];
  }
  return `${timeRanges[0].split("-")[0]} - ${
    timeRanges[timeRanges.length - 1].split("-")[1]
  }`;
}

type Props = {
  selectService: (data: GroupedServiceItem) => void;
  selectedServices: Array<GroupedServiceItem>;
  openingHours: Array<OpeningHour>;
  appliedDiscount: Omit<Discount, "workspace"> | null;
  workspaceId: number | undefined;
  userId: number | undefined;
  clearSelection: () => void;
  isSmallScreen?: boolean;
  close?: () => void;
  selectedPackages: GroupedService[];
  selectPackage: React.Dispatch<React.SetStateAction<GroupedService>>
};

enum Views {
  ROOT = "root",
  CALENDER = "calender",
  CUSTOMER = "customer",
  RECEIPT = "receipt",
}

export default function Summary(props: Props) {
  const {
    selectService,
    selectedServices,
    openingHours,
    appliedDiscount,
    workspaceId,
    selectedPackages,
    clearSelection,
    isSmallScreen,
    close,
    selectPackage
  } = props;
  const divRef = useRef<HTMLDivElement>(null);
  const token = getAppToken();
  const [divWidth, setDivWidth] = useState(0);
  const [view, setView] = useState<Views>(Views.ROOT);
  const [rawDate, setRawDate] = useState<{ date: string; hours: string[] }>({
    date: "",
    hours: [],
  });
  const [loading, showLoading] = useState(false);
  const [bookingDate, setBookingDate] = useState<string[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [bookedServices, setBookedServices] = useState<
    Array<GroupedServiceItem>
  >([]);

  const updateWidth = () => {
    if (divRef.current) {
      const { width } = divRef?.current?.getBoundingClientRect();
      setDivWidth(width);
    }
  };

  useEffect(() => {
    updateWidth();

    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const paymentOptions = [
    {
      name: "Cash",
      disabled: false,
      onClick: () => {},
    },
    {
      name: "Transfer",
      disabled: false,
      onClick: () => {},
    },
    {
      name: "Debit card",
      disabled: false,
      onClick: () => {},
    },
    {
      name: "Other",
      disabled: true,
      onClick: () => {},
    },
  ];

  const serviceSum = calculateTotalPriceAndMinHours(selectedServices, selectedPackages);

  const onDateSelected = (data: { date: string; hours: string[] }) => {
    const sorted_times = data.hours.sort(compareTimeRangesForSort);
    var arr_times: any = [];
    sorted_times.map((time, i) => {
      arr_times.push(
        `${moment(data.date, "YYYY-MM-DD").format("YYYY-MM-DD")} ${formatTime(
          time
        )}`
      );
    });
    setBookingDate(arr_times);
    setRawDate(data);
    setView(Views.ROOT);
  };

  const finalPrice = useMemo(() => {
    if (appliedDiscount) {
      return (
        serviceSum.totalPrice -
        (serviceSum.totalPrice * appliedDiscount.percentage) / 100
      );
    }
    return serviceSum.totalPrice;
  }, [appliedDiscount, serviceSum]);

  useEffect(() => {
    if (selectedServices.length === 0) {
      setBookingDate([]);
      setRawDate({
        date: "",
        hours: [],
      });
      setView(Views.ROOT);
    }
  }, [selectedServices]);

  const getTransactionDate = (dateArr: Date[]) => {
    const newFormattedDateArray = dateArr?.map((x) => {
      const newDate = new Date(x);
      const unFormated_date = newDate.getDate();
      const date =
        unFormated_date.toString().length < 2
          ? `0${unFormated_date}`
          : unFormated_date;
      const year = newDate.getFullYear();
      const month = newDate.getMonth() + 1;
      const newMonth = month.toString().length < 2 ? `0${month}` : month;
      const hour = newDate.getHours();
      const newHour = hour.toString().length < 2 ? `0${hour}` : hour;
      const minute = newDate.getMinutes();
      const newMinute = minute.toString().length < 2 ? `0${minute}` : minute;
      const formattedDate = `${year}-${newMonth}-${date} ${newHour}:${newMinute}:00`;
      return formattedDate;
    });
    return newFormattedDateArray;
  };

  async function bookSpace(type: string) {
    if (userId === null) {
      throw new Error("Invalid user provided, please try again.");
    }
    try {
      var obj: Record<string, any> = {
        workspaces_id: workspaceId,
        user_id: userId,
        booking_date: bookingDate,
        status: "Pending",
      };
      var _services: any[] = [];
      selectedServices.map((service) => {
        _services.push({
          service_id: service.id,
          price: service.price,
          service_name: service.name,
          home_service_price: service.home_service_price,
          space_id: workspaceId,
          type: service?.type || "walk-in",
          min_hour: service.min_hour,
          asset_id: service?.groupId ? service?.groupId : null,
        });
      });
      selectedPackages.map(p => {
        p.services.forEach(service => {
          _services.push({
            service_id: service.id,
            price: service.price,
            service_name: service.name,
            home_service_price: service.home_service_price,
            space_id: workspaceId,
            type: service?.type || "walk-in",
            min_hour: service.min_hour,
            asset_id: service?.groupId ? service?.groupId : null,
          });
        })
      })
      obj.services = _services;
      showLoading(true);
      const res = await BOOK_SPACE(token, obj);
      if (res.status !== true) {
        const { error } = handleResponse(res);
        toast.error(error);
      } else {
        let total = finalPrice;
        let trnxPayload: Record<string, any> = {
          amount_paid: total,
          user_id: userId as number,
          workspace_bookings_id: res.data.id,
          payment_status: "success",
          transaction_date: getTransactionDate([new Date()])[0],
          transaction_id: generateId(),
          message: "",
          guests: [],
          payment_channel: type,
          payment_type: type, // I am assuming payment_channel is supposed to be payment_type but I don't want to scatter the codebase until I check with timi first before remove payment_channel
        };
        if (appliedDiscount) {
          trnxPayload.discount_id = appliedDiscount?.id;
        }

        const transactionRes = await CREATE_TRANSACTION(token, trnxPayload);
        const { status, error } = handleResponse(transactionRes);
        if (status) {
          toast.success("Service booked successfully");
          setBookedServices(selectedServices);
          setBookingDate([]);
          clearSelection();
          setView(Views.RECEIPT);
        } else {
          toast.success(error, { type: "success" });
        }
      }
    } catch (err) {
      showLoading(false);
      toast.error("Something went wrong, please try again.");
    } finally {
      showLoading(false);
    }
  }

  if (view === Views.CUSTOMER) {
    return (
      <Customer
        next={(id) => {
          setView(Views.ROOT);
          setUserId(id);
        }}
      />
    );
  }

  if (view === Views.RECEIPT) {
    return (
      <Receipt
        isSmallScreen={isSmallScreen}
        services={bookedServices}
        close={() => {
          setView(Views.ROOT);
          close?.();
        }}
      />
    );
  }

  var itemsLength = [...selectedServices, ...selectedPackages].length

  return (
    <div
      ref={divRef}
      className={`${
        isSmallScreen ? "w-[100%]" : "w-[35%]"
      } flex flex-col justify-between`}
      style={{ height: "calc(100vh - 70px)" }}
    >
      {itemsLength > 0 && (
        <div
          className="w-[100%] bg-[#ECECEE] items-center p-[15px] justify-between"
          style={{ display: view === Views.CALENDER ? "none" : "flex" }}
        >
          <p className="font-jakarta">Selected services</p>
          {isSmallScreen && (
            <button onClick={() => close?.()}>
              <TimesIcon />
            </button>
          )}
        </div>
      )}

      {itemsLength === 0 && (
        <div className="w-full flex flex-col items-center pt-[50px]">
          <img src="/empty_bookings.png" className="w-[250px]" />
          <p className="font-jakarta text-[grey] mt-[10px]">
            Selected services will appear here.
          </p>
        </div>
      )}

      <div
        className="h-full overflow-y-scroll scrollbar-hide"
        style={{ display: view === Views.CALENDER ? "none" : "" }}
      >
        {selectedServices.map((service, i) => (
          <div
            key={i}
            className="flex w-[100%] items-center px-[10px] py-[8px] border-b-[1px] border-b-[lightgrey]"
          >
            <img
              src={service.images[0]?.url}
              className="h-[40px] w-[40px] rounded"
            />
            <p className="w-[50%] ml-[15px] text-[15px] font-jakarta">
              {service.name}
            </p>
            <p className="w-[25%] font-jakarta text-[15px]">
              {service.min_hour}hr{service.min_hour > 1 ? "s" : ""}
            </p>
            <p className="w-[25%] font-jakarta text-[15px]">
              ₦{FormatAmount(service.price)}
            </p>
            <button onClick={() => selectService(service)}>
              <TrashIcon size={25} color="red" />
            </button>
          </div>
        ))}
        {selectedPackages.map((packageItem, i) => {

          var { totalMinHours } = calculateTotalPriceAndMinHours(packageItem.services)

          return (
            <div key={i} className=" border-b-[1px] border-b-[lightgrey]">
              <div
                className="flex w-[100%] items-center px-[10px] py-[8px]"
              >
                <img
                  src={packageItem.services[0].images[0]?.url}
                  className="h-[40px] w-[40px] rounded"
                />
                <p className="w-[50%] ml-[15px] text-[15px] font-jakarta">
                  {packageItem.name}
                </p>
                <p className="w-[25%] font-jakarta text-[15px]">{totalMinHours}hr{totalMinHours > 0 && 's'}</p>
                <p className="w-[25%] font-jakarta text-[15px]">
                  ₦{FormatAmount(packageItem.packagePrice)}
                </p>
                <button onClick={() => selectPackage(packageItem)}>
                  <TrashIcon size={25} color="red" />
                </button>
              </div>
              {packageItem.services.map((service, i) => (
                <div key={i} className="flex w-[100%] py-[8px]  px-[10px] items-center">
                  <div className="h-[40px] w-[40px] rounded" />
                  <img
                    src={service.images[0]?.url}
                    className="h-[40px] w-[40px] rounded ml-[15px]"
                  />
                  <p className="w-[50%] ml-[15px] text-[15px] font-jakarta">
                    {service.name}
                  </p>
                  <p className="w-[25%] font-jakarta text-[15px]">
                    {/* {service.min_hour}hr{service.min_hour > 1 ? "s" : ""} */}
                  </p>
                  <p className="w-[25%] font-jakarta text-[15px]">
                    {/* ₦{FormatAmount(packageItem.packagePrice)} */}
                  </p>
                  <div className="h-[25px] w-[25px] rounded" />
                </div>
              ))}
            </div>
          )
        })}
      </div>

      <div
        className="h-auto w-[100%] border-t-[1px] border-t-[lightgrey] p-[20px]"
        style={{ display: view === Views.CALENDER ? "none" : "" }}
      >
        <div className="w-full">
          <div>
            {serviceSum.totalMinHours > 0 && (
              <div className="flex jusify-center w-full mb-[5px]">
                <p className="font-jakarta">Total duration:</p>
                <p className="font-bold font-jakarta">
                  {" "}
                  {serviceSum.totalMinHours}hr
                  {serviceSum.totalMinHours > 1 ? "s" : ""}
                </p>
              </div>
            )}
            {appliedDiscount && (
              <div className="flex jusify-center w-full mb-[5px]">
                <p className="font-jakarta">Discount:</p>
                <p className="font-bold font-jakarta">
                  {" "}
                  {appliedDiscount.percentage}%
                </p>
              </div>
            )}

            {bookingDate.length > 0 && (
              <div className="flex jusify-center w-full mb-[5px]">
                <p className="font-jakarta">Booking date: </p>
                <p className="font-bold font-jakarta">
                  {" "}
                  {moment(rawDate.date).format("ddd MMM DD, YYYY")};{" "}
                  {combineTimeRanges(rawDate.hours.join(", "))}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col my-[15px]">
            <p className="p-[0px] m-[0px] font-jakarta">Total: </p>
            <div className="flex items-center">
              <p className="text-[35px] font-bold text-accent_blue font-jakarta">
                ₦{FormatAmount(finalPrice)}
              </p>
              {appliedDiscount && (
                <p
                  className="text-[25px] text-accent_blue font-jakarta"
                  style={{ textDecorationLine: "line-through" }}
                >
                  ₦{serviceSum.totalPrice}
                </p>
              )}
            </div>
          </div>
        </div>
        {bookingDate.length === 0 ? (
          <button
            onClick={() => setView(Views.CALENDER)}
            disabled={itemsLength === 0}
            className="w-full flex items-center justify-center bg-accent_blue rounded-[8px] py-[15px] border-[1px] border-[lightgrey]"
            style={{
              opacity: itemsLength === 0 ? 0.5 : 1,
              cursor: itemsLength === 0 ? "not-allowed" : "pointer",
            }}
          >
            <p className="text-[white] font-jakarta">Next</p>
          </button>
        ) : (
          <div className="h-auto">
            {loading ? (
              <div className="h-[100px] overflow-hidden flex items-center justify-center">
                <Loading />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-[10px]">
                {paymentOptions.map((option, i) => (
                  <button
                    disabled={option.disabled}
                    key={i}
                    onClick={() =>
                      userId ? bookSpace(option.name) : setView(Views.CUSTOMER)
                    }
                    className="h-[40px] text-white w-full bg-accent_blue font-jakarta"
                    style={{
                      opacity: option.disabled ? 0.5 : 1,
                      cursor: option.disabled ? "not-allowed" : "pointer",
                    }}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ display: view === Views.CALENDER ? "flex" : "none" }}>
        <Slots
          duration={serviceSum.totalMinHours}
          containerWidth={divWidth}
          openingHours={openingHours}
          onDone={(data) => onDateSelected(data)}
          goBack={() => setView(Views.ROOT)}
        />
      </div>
    </div>
  );
}
