import { Repo } from "src/core/repo";
import { Usuario } from "./persistence/Usuario";
import { Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm/repository/Repository";

export abstract class RepoUsuarios extends Repo<Usuario> {

    //ad hoc
    abstract finfByFirstName(firstName: string): Promise<Usuario>;
    //abstract findByEmail(email: string): Usuario;

}

// Implementación del repositorio (infraestructura)
export class RepoUsuariosTypeOrm extends RepoUsuarios {

    constructor(
        @InjectRepository(Usuario)
        private usuariosRepository: Repository<Usuario>,
    ){
        super();
    }

    save = (entity: Usuario) => {
        this.usuariosRepository.save(entity);
    }

    delete (id: string): void {
        this.usuariosRepository.delete(id);
    }
    /*
    delete = (id: string) => {
        this.usuariosRepository.delete(id);
    }*/

    findById(id: string){
        return this.usuariosRepository.findOneBy({
            id: Number(id)
        })
    }

    async finfByFirstName(firstName: string): Promise<Usuario> {
        return await this.usuariosRepository.findOneBy({
                firstName
        });
    }

}