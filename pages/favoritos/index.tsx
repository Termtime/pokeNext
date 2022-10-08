import {Layout} from "../../components/layouts";
import {NextPageWithLayout} from "../_app";

interface FavoritosPageProps {}

const FavoritosPage: NextPageWithLayout = () => {
  return <></>;
};

FavoritosPage.getLayout = (page) => {
  return <Layout title="PokéNext - Favoritos">{page}</Layout>;
};
export default FavoritosPage;
