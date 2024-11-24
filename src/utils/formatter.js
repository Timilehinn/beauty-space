import { getRandomColor } from "."

export function groupServicesByGroup(services) {
  const groupedServices = []

  services.forEach((service) => {
    service.groups.forEach((group) => {
      const existingGroup = groupedServices.find((item) => item.id === group.id);
      if (existingGroup) {
        existingGroup.services.push({
          groupId: group.id,
          id: service.id,
          name: service.name,
          price: service.price,
          min_hour: service.min_hour,
          home_service_price: service.home_service_price,
          type: service.type,
          created_at: service.created_at,
          updated_at: service.updated_at,
          images: service.photos,
        })
      } else {
        groupedServices.push({
          id: group.id,
          name: group.name,
          isPackage: group.is_package,
          packagePrice: group.price,
          asset_urls: group.asset_urls,
          user_id: group.user_id,
          created_at: group.created_at,
          updated_at: group.updated_at,
          bgColor: getRandomColor(),
          services: [
            {
              groupId: group.id,
              id: service.id,
              name: service.name,
              price: service.price,
              min_hour: service.min_hour,
              home_service_price: service.home_service_price,
              type: service.type,
              created_at: service.created_at,
              updated_at: service.updated_at,
              images: service.photos,
            },
          ],
        })
      }
    })
  });

  return groupedServices
}
