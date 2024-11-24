import React from "react";
import { GroupedServiceItem } from "../../../../global/types";
import { TimesIcon } from "../../../../assets/icons";
import { FormatAmount } from "../../../../utils/formatAmount";

type ReceiptProps = {
  services: Array<GroupedServiceItem>;
  close: () => void;
  isSmallScreen?: boolean
};

export default function Receipt(props: ReceiptProps) {
  const { services, close, isSmallScreen } = props;

  return (
    <div
      className={`${isSmallScreen? "w-[100%]" : "w-[35%]"} flex flex-col justify-between`}
      style={{ height: "calc(100vh - 70px)" }}
    >
      <div className="flex items-center justify-between border-b-[1px] border-b-[lightgrey] px-[10px] py-[10px]">
        <p className="font-jakarta">Receipt</p>
        <button
          onClick={close}
          className="p-[5px] rounded-[2px] border-[1px] border-[lightgrey]"
        >
          <TimesIcon />
        </button>
      </div>
      <div className="w-full">
        <div
          className="flex w-[100%] items-center px-[10px] py-[8px] border-b-[1px] border-b-[lightgrey]"
        >
          <p className="w-[50%] text-[15px] font-jakarta font-bold">
            Service
          </p>
          <p className="w-[25%] font-jakarta text-[15px] font-bold">
            Duration
          </p>
          <p className="w-[25%] font-jakarta text-[15px] font-bold">
            Price (₦)
          </p>
        </div>
      </div>
      <div className="w-full flex-1 overflow-y-scroll scrollbar-hide">
        {services.map((service, i) => (
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
              {service.min_hour}
            </p>
            <p className="w-[25%] font-jakarta text-[15px]">
              ₦{FormatAmount(service.price)}
            </p>
          </div>
        ))}
      </div>
      <div className="w-full p-[10px] border-t-[1px] border-t-[lightgrey] py-[16.5px]">
        <button
          onClick={() => {}}
          className="w-full flex items-center justify-center bg-accent_blue rounded-[8px] py-[15px] border-[1px] border-[lightgrey]"
        >
          <p className="text-[white] font-jakarta">Print receipt</p>
        </button>
      </div>
    </div>
  );
}
