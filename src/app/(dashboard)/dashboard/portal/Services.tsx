import Image from "next/image";
import React, { useMemo, useState } from "react";

import { CartIcon } from "../../../../assets/icons";
import {
  Business,
  Discount,
  GroupedService,
  GroupedServiceItem,
} from "../../../../global/types";
import { getAppToken } from "../../../../utils";
import { FormatAmount } from "../../../../utils/formatAmount";
import Loading from "../../../loading";
import Footer from "./Footer";

type Props = {
  groups: Array<GroupedService>;
  selectService: (data: GroupedServiceItem) => void;
  selectedServices: Array<GroupedServiceItem>;
  discounts: Array<Discount>;
  workspaceId?: number;
  setAppliedDiscount: React.Dispatch<
    React.SetStateAction<Omit<Discount, "workspace"> | null>
  >;
  loading: boolean;
  business: Business | null;
  isSmallScreen: boolean;
  showServiceListView: React.Dispatch<React.SetStateAction<boolean>>;
  selectedPackages: GroupedService[], 
  setSelectedPackages: React.Dispatch<React.SetStateAction<GroupedService[]>>;
  selectPackage: React.Dispatch<React.SetStateAction<GroupedService>>
};

export default function Services(props: Props) {
  const token = getAppToken();

  const {
    groups,
    selectService,
    selectedServices,
    discounts,
    workspaceId,
    setAppliedDiscount,
    loading,
    business,
    isSmallScreen,
    showServiceListView,
    selectedPackages, 
    setSelectedPackages,
    selectPackage
  } = props;

  const [searchVal, setSearchVal] = useState("");

  const getServices = (data: Array<GroupedServiceItem>) => {
    return data.filter((service) => service.price >= 0);
  };

  const isSelected = (id: number, isPackage?: boolean) => {
    if(isPackage){
      return selectedPackages.find(p => p.id === id) !== undefined
    }
    return selectedServices.find((s) => s.id === id) !== undefined;
  };

  const filteredGroups = useMemo(() => {
    var filterBySearch = groups
      .map((g) => {
        var searchPackages = g.name.toLowerCase().includes(searchVal.toLowerCase())
        if(searchPackages){
          return g
        }
        var serviceList = g.services.filter((service) =>
          service.name.toLowerCase().includes(searchVal.toLowerCase())
        );
        return {
          ...g,
          services: serviceList,
        };
      })
      .filter((g) => g.services.length > 0);
    return filterBySearch;
  }, [searchVal, groups]);

  return (
    <main
      style={{ height: "calc(100vh - 70px)" }}
      className={`${
        isSmallScreen ? "w-[100%]" : "w-[65%]"
      } border-r-[1px] border-r-[lightgrey]`}
    >
      {loading ? (
        <div className="h-full w-full flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <section className="p-[20px]" style={{ height: "calc(100% - 90px)" }}>
          <header className="flex items-center justify-between mb-[15px]">
            <input
              name="search"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search service"
              className="rounded-[10px] indent-4 border-[1px] border-lightgrey w-[50%] h-[50px] focus:border-primary outline-none"
            />

            {isSmallScreen && (
              <button
                onClick={() => showServiceListView(true)}
                className="flex items-center p-[5px] bg-accent_blue px-[15px] rounded-[5px]"
              >
                <CartIcon size={20} color="white" />
                <p className="font-jakarta font-bold px-[3px] text-white">
                  {selectedServices.length}
                </p>
              </button>
            )}
          </header>

          {filteredGroups.length === 0 && (
            <div className="w-full h-full flex flex-col items-center">
              <p className="font-jakarta text-[25px] max-w-[50%] text-center mb-[15px] text-[grey] mt-[100px]">
                No services found{" "}
                <span
                  style={{ display: searchVal.length > 0 ? "flex" : "none" }}
                  className="italic font-bold break-words"
                >
                  for '{searchVal}'
                </span>
              </p>
            </div>
          )}

          <section
            className="w-[100%] h-[100%] overflow-y-scroll scrollbar-hide"
            style={{ height: "calc(100% - 50px)" }}
          >
            {filteredGroups.map((group, i) => {
              var services = getServices(group.services);

              if (group.isPackage) {
                return (
                  <div
                    onClick={() => selectPackage(group)}
                    key={i}
                    style={{ backgroundColor: group.bgColor }}
                    className={`w-[200px] border-[1px] p-[10px] border-[lightgrey] mr-[10px] mb-[10px] rounded-[8px] cursor-pointer ${
                      isSelected(group.id, true) ? "border-[3px] border-accent_blue" : ""
                    }`}
                  >
                    <h3 className="font-jakarta text-white text-[17px] font-bold">
                      {group.name}
                    </h3>

                    <div className="h-[25%] w-[100%]">
                      <p className="font-jakarta mt-[70px] text-white text-[15px] mb-[5px]">
                        {group.services.length} service
                        {group.services.length > 0 && "s"}
                      </p>
                      {group.services[0].price > 0 && (
                        <p className="font-jakarta text-white text-[14px]">
                          Type: Walk-in
                        </p>
                      )}
                      {group.services[0].home_service_price > 0 && (
                        <p className="font-jakarta text-white text-[14px]">
                          Type: Home service
                        </p>
                      )}
                      <p className="font-jakarta text-white mt-[5px] text-[14px]">
                        Price: ₦{FormatAmount(group.packagePrice)}
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={i}
                  className="flex flex-col justify-start items-start gap-5 w-full mb-[20px]"
                >
                  <div className="flex items-center">
                    <h3 className="font-jakarta mr-[45px] text-[18px] font-bold">
                      {group.name}
                    </h3>
                  </div>
                  {group.isPackage && (
                    <p className="font-jakarta mt-[-13px]">
                      Package price: ₦{FormatAmount(group.packagePrice)}
                    </p>
                  )}
                  <div className="flex flex-wrap">
                    {services.length === 0 && (
                      <p className="font-jakarta text-[15px] mb-[15px] text-[grey]">
                        No services found under{" "}
                        <span className="italic font-bold">'{group.name}'</span>
                      </p>
                    )}
                    <section className="flex justify-start items-stretch gap-5 w-full flex-wrap flex-shrink-0">
                      {services.map((service, i) => {
                        if (!service.images[0]?.url) {
                          return (
                            <div
                              onClick={() => selectService(service)}
                              key={i}
                              style={{ backgroundColor: group.bgColor }}
                              className={`w-[200px] border-[1px] mt-[10px] p-[10px] border-[lightgrey] mr-[10px] mb-[10px] rounded-[8px] cursor-pointer ${
                                isSelected(service.id)
                                  ? "border-[3px] border-accent_blue"
                                  : ""
                              }`}
                            >
                              <div className="h-[100px] ">
                                <p className="font-jakarta p-[0px] m-[0px] text-white text-[14px] font-bold">
                                  {service.name}
                                </p>
                              </div>

                              <div className="h-[25%] w-[100%]">
                                {!group.isPackage && (
                                  <p className="font-jakarta p-[0px] m-[0px] text-white text-[12px]">
                                    From: ₦
                                    {FormatAmount(
                                      service.price > 0
                                        ? service.price
                                        : service.home_service_price
                                    )}
                                  </p>
                                )}

                                <p className="font-jakarta p-[0px] m-[0px] text-white text-[12px]">
                                  Duration: {service.min_hour}
                                  {service.min_hour > 1 ? "s" : ""}
                                </p>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div
                            onClick={() => selectService(service)}
                            key={i}
                            className={`w-[200px] cursor-pointer flex flex-col justify-start items-stretch ${
                              isSelected(service.id)
                                ? "border-2 border-primary rounded-lg"
                                : "border border-lightgrey rounded-lg "
                            }`}
                          >
                            <Image
                              src={service.images[0]?.url}
                              alt="service-image"
                              width={250}
                              height={150}
                              className="rounded-t-md w-full h-[150px]  bg-cover bg-top"
                            />
                            <div className="flex flex-col justify-start items-start  p-2">
                              <p className="font-jakarta font-semibold capitalize">
                                {service.name}
                              </p>
                              {!group.isPackage && (
                                <p className="font-jakarta p-[0px] m-[0px] text-[12px]">
                                  From: ₦
                                  {FormatAmount(
                                    service.price > 0
                                      ? service.price
                                      : service.home_service_price
                                  )}
                                </p>
                              )}
                              <p className="font-jakarta text-sm">
                                Duration: {service.min_hour}
                                {service.min_hour > 1 ? "hrs" : "hr"}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </section>
                  </div>
                </div>
              );
            })}
          </section>
        </section>
      )}

      {!loading && (
        <Footer
          qrCode={business?.qr_code}
          services={selectedServices}
          discounts={discounts}
          workspaceId={business?.id}
          onDiscountValidated={(data) => {
            setAppliedDiscount(data);
          }}
        />
      )}
    </main>
  );
}
